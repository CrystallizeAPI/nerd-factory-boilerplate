import {
    ClientInterface,
    createClient,
    createOrderFetcher,
    createOrderPaymentUpdater,
    createOrderPipelineStageSetter,
    createOrderPusher,
    createSubscriptionContractManager,
} from '@crystallize/js-api-client';
import { asFunction, asValue, createContainer, InjectionMode } from 'awilix';
import { createAuthenticator } from './authenticator.server';
import { createContractBillComputer } from '@/domain/use-cases/compute-subscription-contract-bill.server';
import { createCustomerCreator } from '@/domain/use-cases/create-customer-if-needed.server';
import { createOrderInstanciator } from '@/domain/use-cases/create-new-order-from-contract-and-usage.server';
import { createSubscriptionFetcher } from '@/domain/use-cases/fetch-subscriptions.server';
import { createSubscriber } from '@/domain/use-cases/subscribe-to-suscription.server';
import { createMyAccountPageDataFetcher } from '@/domain/use-cases/fetch-my-account-data.server';
import { createOrderPaymentStatusUpdater } from '@/domain/use-cases/update-order-payment-status.server';
import { createOrderPipelineChangeHandler } from '@/domain/use-cases/handle-order-pipeline-change.server';

const crystallizeClient = createClient(
    {
        tenantIdentifier: `${process.env.CRYSTALLIZE_TENANT_IDENTIFIER}`,
        tenantId: process.env.CRYSTALLIZE_TENANT_ID,
        accessTokenId: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
        accessTokenSecret: process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
    },
    {
        extraHeaders: {
            'X-Discovery-Feature-Flags': 'structuredSubscriptionPlans',
        },
    },
);
const subscriptionContractManager = createSubscriptionContractManager(crystallizeClient);

const orderManagerInstance = {
    push: createOrderPusher(crystallizeClient),
    updatePayment: createOrderPaymentUpdater(crystallizeClient),
    updatePipelineStage: createOrderPipelineStageSetter(crystallizeClient),
    fetch: createOrderFetcher(crystallizeClient),
};

type Container = {
    crystallizeClient: ClientInterface;
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
    authenticator: ReturnType<typeof createAuthenticator>;
    subscriptionFetcher: ReturnType<typeof createSubscriptionFetcher>;
    subscriptionContractManager: ReturnType<typeof createSubscriptionContractManager>;
    orderManager: typeof orderManagerInstance;

    // use cases
    computeContractBill: ReturnType<typeof createContractBillComputer>;
    createCustomerIfNeeded: ReturnType<typeof createCustomerCreator>;
    createNewOrderFromContractAndUsage: ReturnType<typeof createOrderInstanciator>;
    subscribe: ReturnType<typeof createSubscriber>;
    fetchMyAccountData: ReturnType<typeof createMyAccountPageDataFetcher>;
    updateOrderPaymentStatus: ReturnType<typeof createOrderPaymentStatusUpdater>;
    handlerOrderPipelineChange: ReturnType<typeof createOrderPipelineChangeHandler>;
};

const container = createContainer<Container>({
    injectionMode: InjectionMode.PROXY,
    strict: true,
});

container.register({
    crystallizeClient: asValue(crystallizeClient),
    authenticator: asFunction(createAuthenticator)
        .inject(() => ({
            authSecret: `${process.env.AUTH_SECRET}`,
        }))
        .singleton(),
    pipelineConfiguration: asValue({
        paymentFlow: {
            id: '6772fe8bbb3f753d1601d885',
            stages: {
                toCapture: '6772fe8bbb3f753d1601d881',
                processing: '6772fe8bbb3f753d1601d882',
                success: '6772fe8bbb3f753d1601d884',
                failed: '6772fe8bbb3f753d1601d883',
            },
        },
    }),
    computeContractBill: asFunction(createContractBillComputer).singleton(),
    createCustomerIfNeeded: asFunction(createCustomerCreator).singleton(),
    createNewOrderFromContractAndUsage: asFunction(createOrderInstanciator).singleton(),
    subscriptionFetcher: asFunction(createSubscriptionFetcher).singleton(),
    subscriptionContractManager: asValue(subscriptionContractManager),
    orderManager: asValue(orderManagerInstance),
    subscribe: asFunction(createSubscriber).singleton(),
    fetchMyAccountData: asFunction(createMyAccountPageDataFetcher).singleton(),
    updateOrderPaymentStatus: asFunction(createOrderPaymentStatusUpdater).singleton(),
    handlerOrderPipelineChange: asFunction(createOrderPipelineChangeHandler).singleton(),
});

const {
    authenticator,
    computeContractBill,
    createCustomerIfNeeded,
    createNewOrderFromContractAndUsage,
    subscriptionFetcher,
    subscribe,
    fetchMyAccountData,
    updateOrderPaymentStatus,
    handlerOrderPipelineChange,
} = container.cradle;

export {
    authenticator,
    fetchMyAccountData,
    subscribe,
    computeContractBill,
    createCustomerIfNeeded,
    createNewOrderFromContractAndUsage,
    subscriptionFetcher,
    updateOrderPaymentStatus,
    handlerOrderPipelineChange,
};
