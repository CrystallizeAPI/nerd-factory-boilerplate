import { Customer } from '@crystallize/js-api-client';

export type SubscriptionContractIntent = {
    subscription: {
        name: string;
    };
    variant: {
        name: string;
    };
    plan: {
        identifier: string;
        name: string;
    };
    period: {
        id: string;
        name: string;
    };
    priceVariant: {
        name: string;
        identifier: string;
        currency: string;
        price: number;
    };
    sku: string;
    path: string;
    customer?: Customer;
};
