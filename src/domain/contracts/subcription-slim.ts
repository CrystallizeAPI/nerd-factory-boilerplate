import { RichTextContent } from '@crystallize/js-api-client';

type Image = {
    url: string;
    key: string;
    width: number;
    height: number;
    variants: Array<{
        url: string;
        key: string;
        width: number;
        height: number;
    }>;
};
type Phase = {
    period: number;
    unit: string;
    meteredVariables: Array<{
        identifier: string;
        name: string;
        unit: string;
        tierType: string;
    }>;
    priceVariants: {
        [identifier: string]: {
            price: number;
            currency: string;
        };
    };
};
export type SubscriptionSlim = {
    name: string;
    path: string;
    variants: Array<{
        name: string;
        sku: string;
        description: RichTextContent['json'];
        firstImage: Image;
        subscriptionPlans: Array<{
            identifier: string;
            name: string;
            periods: Array<{
                name: string;
                id: string;
                initial?: Phase;
                recurring: Phase;
            }>;
        }>;
    }>;
};
