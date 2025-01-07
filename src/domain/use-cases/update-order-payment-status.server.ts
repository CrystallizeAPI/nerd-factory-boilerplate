import { createOrderPaymentUpdater, createOrderPipelineStageSetter, Order } from '@crystallize/js-api-client';

type Deps = {
    orderManager: {
        updatePayment: ReturnType<typeof createOrderPaymentUpdater>;
        updatePipelineStage: ReturnType<typeof createOrderPipelineStageSetter>;
    };
    pipelineConfiguration: {
        paymentFlow: {
            id: string;
            stages: {
                success: string;
                failed: string;
            };
        };
    };
};

export const createOrderPaymentStatusUpdater =
    ({ orderManager, pipelineConfiguration }: Deps) =>
    async (order: Order, paymentStatus: 'success' | 'failed', from: string) => {
        await orderManager.updatePayment(order.id, {
            payment: [
                {
                    //@ts-expect-error - It's an enum in the API
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
                                value: from,
                            },
                        ],
                    },
                },
            ],
        });

        await orderManager.updatePipelineStage(
            order.id,
            pipelineConfiguration.paymentFlow.id,
            paymentStatus === 'failed'
                ? pipelineConfiguration.paymentFlow.stages.failed
                : pipelineConfiguration.paymentFlow.stages.success,
        );
    };
