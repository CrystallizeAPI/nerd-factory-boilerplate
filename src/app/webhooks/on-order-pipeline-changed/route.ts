import { container } from "@/core/container.server";
import { putOrderInPipelineStage } from "@/core/put-order-in-pipeline-stage.server";
import { Order, createOrderPaymentUpdater } from "@crystallize/js-api-client";
import { NextResponse } from "next/server";

// @todo: Signature verifiacation
export async function POST(request: Request) {
    const body = await request.json();
    const order = body.order.get as Order;
    const pipelineEvent = body.pipeline.get;

    if (pipelineEvent.id !== container.pipelines.paymentFlow.id) {
        return new Response(`Unauthorized.`, { status: 401 });
    }
    const orderPipelineStageId: string = body.order.get.pipelines.find((p: {
        pipeline: {
            id: string;
        };
        stageId: string;
    }) => {
        return p.pipeline.id === container.pipelines.paymentFlow.id;
    })?.stageId

    switch (orderPipelineStageId) {
        case container.pipelines.paymentFlow.stages.toCapture:
            const orderPaymentUpdater = createOrderPaymentUpdater(container.crystallizeClient);
            const paymentStatus = Math.random() > 0.3 ? 'success' : 'failed';
            await orderPaymentUpdater(order.id, {
                payment: [
                    {
                        //@ts-ignore
                        provider: 'custom',
                        custom: {
                            properties: [
                                {
                                    property: 'payment_method',
                                    value: 'Crystal Coin',
                                },
                                {
                                    property: 'wallet_id',
                                    value: order.customer.identifier,
                                },
                                {
                                    property: 'amount',
                                    value: String(order.total?.gross || 0),
                                },
                                {
                                    property: 'status',
                                    value: paymentStatus,
                                },
                                {
                                    property: 'via',
                                    value: 'OrderReCapture',
                                }
                            ],
                        },
                    },
                ],
            });

            await putOrderInPipelineStage({
                orderId: order.id,
                pipelineId: container.pipelines.paymentFlow.id,
                stageId: paymentStatus === 'failed' ? container.pipelines.paymentFlow.stages.failed : container.pipelines.paymentFlow.stages.success,
            }, { client: container.crystallizeClient });

            return NextResponse.json({
                orderId: order.id,
                status: paymentStatus,
            });
        case container.pipelines.paymentFlow.stages.processing:
        case container.pipelines.paymentFlow.stages.failed:
        case container.pipelines.paymentFlow.stages.success: {
            //do something here

            return NextResponse.json({
                orderId: order.id,
            });
        }
        default:

    }
    return new Response(`Unauthorized.`, { status: 401 });
}