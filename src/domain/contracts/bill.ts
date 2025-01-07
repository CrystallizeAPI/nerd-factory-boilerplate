import { SubscriptionContract } from '@crystallize/js-api-client';
import { Period } from './period';

export type Bill = {
    price: number;
    currency: string;
    range: Period['range'];
    phase: SubscriptionContract['recurring'];
    variables: Record<
        string,
        {
            id: string;
            usage: number;
            price: number;
        }
    >;
};
