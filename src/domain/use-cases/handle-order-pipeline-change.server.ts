import { Order, createOrderPipelineStageSetter } from '@crystallize/js-api-client';

type Deps = {
    pipelineConfiguration: {
        paymentFlow: {
            id: string;
            stages: {
                toCapture: string;
                processing: string;
                success: string;
                failed: string;
            };
        };
    };
    updateOrderPaymentStatus: (order: Order, paymentStatus: 'success' | 'failed', from: string) => Promise<void>;
    orderManager: {
        updatePipelineStage: ReturnType<typeof createOrderPipelineStageSetter>;
    };
};

export const createOrderPipelineChangeHandler =
    ({ pipelineConfiguration, updateOrderPaymentStatus, orderManager }: Deps) =>
    async (
        order: Order,
        pipelineEvent: { id: string },
        orderPipelines: {
            pipeline: {
                id: string;
            };
            stageId: string;
        }[],
    ) => {
        if (pipelineEvent.id !== pipelineConfiguration.paymentFlow.id) {
            return new Response(`Unauthorized.`, { status: 401 });
        }
        const orderPipelineStageId = orderPipelines.find(
            (p: {
                pipeline: {
                    id: string;
                };
                stageId: string;
            }) => {
                return p.pipeline.id === pipelineConfiguration.paymentFlow.id;
            },
        )?.stageId;

        switch (orderPipelineStageId) {
            case pipelineConfiguration.paymentFlow.stages.toCapture:
                const paymentStatus = Math.random() > 0.3 ? 'success' : 'failed';
                await updateOrderPaymentStatus(order, paymentStatus, 'OrderReCapture');

                await orderManager.updatePipelineStage(
                    order.id,
                    pipelineConfiguration.paymentFlow.id,
                    paymentStatus === 'failed'
                        ? pipelineConfiguration.paymentFlow.stages.failed
                        : pipelineConfiguration.paymentFlow.stages.success,
                );
                return {
                    orderId: order.id,
                    status: paymentStatus,
                };
            case pipelineConfiguration.paymentFlow.stages.processing:
            case pipelineConfiguration.paymentFlow.stages.failed:
            case pipelineConfiguration.paymentFlow.stages.success: {
                //do something here
                return {
                    orderId: order.id,
                };
            }
            default:
        }
        return;
    };
