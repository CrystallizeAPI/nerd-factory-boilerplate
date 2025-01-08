import { z } from 'zod';
export const SubscriptionChoiceSchema = z
    .object({
        path: z.string(),
        plan: z.string(),
        period: z.string(),
        priceVariant: z.string(),
        sku: z.string(),
    })
    .strict();
export type SubscriptionChoice = z.infer<typeof SubscriptionChoiceSchema>;

export const FORCED_PRICE_VARIANT = 'default';
