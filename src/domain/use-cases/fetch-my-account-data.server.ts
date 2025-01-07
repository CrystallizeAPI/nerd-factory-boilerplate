import { createOrderFetcher, createSubscriptionContractManager, Order } from '@crystallize/js-api-client';

type Deps = {
    subscriptionContractManager: ReturnType<typeof createSubscriptionContractManager>;
    orderManager: {
        fetch: ReturnType<typeof createOrderFetcher>;
    };
};

export const createMyAccountPageDataFetcher =
    ({ subscriptionContractManager, orderManager }: Deps) =>
    async (email: string) => {
        const [contractResults, orderResults] = await Promise.all([
            subscriptionContractManager.fetchByCustomerIdentifier(email),
            orderManager.fetch.byCustomerIdentifier(
                email,
                undefined,
                undefined,
                {
                    subscriptionContractId: true,
                    subscription: {
                        start: true,
                        end: true,
                        name: true,
                        period: true,
                        unit: true,
                        meteredVariables: {
                            id: true,
                            usage: true,
                            price: true,
                        },
                    },
                },
                {
                    reference: true,
                },
            ),
        ]);

        const orders = orderResults.orders as Array<Order & { reference: string }>;
        const contracts = contractResults.contracts;
        return {
            orders,
            contracts,
        };
    };
