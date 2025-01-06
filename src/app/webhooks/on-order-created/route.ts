import { container } from "@/core/container.server";
import { Order, createOrderPaymentUpdater, createOrderPipelineStageSetter } from "@crystallize/js-api-client";
import { NextResponse } from "next/server";

// @todo: Signature verifiacation
export async function POST(request: Request) {
    const body = await request.json();
    const order = body.order.get as Order;
    const orderPaymentUpdater = createOrderPaymentUpdater(container.crystallizeClient);
    const putOrderInPipelineStage = createOrderPipelineStageSetter(container.crystallizeClient);

    const paymentStatus = Math.random() > 0.5 ? 'success' : 'failed';

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
                            value: 'OrderCreated',
                        }
                    ],
                },
            },
        ],
    });

    await putOrderInPipelineStage(order.id,
        container.pipelines.paymentFlow.id,
        paymentStatus === 'failed' ? container.pipelines.paymentFlow.stages.failed : container.pipelines.paymentFlow.stages.success,
    );

    return NextResponse.json({
        orderId: order.id,
    });
}
