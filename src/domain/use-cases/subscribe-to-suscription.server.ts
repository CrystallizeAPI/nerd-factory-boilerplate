import { ClientInterface, createSubscriptionContractManager } from '@crystallize/js-api-client';
import { SubscriptionChoice } from '../contracts/subscription-choice';

type Deps = {
    crystallizeClient: ClientInterface;
    subscriptionContractManager: ReturnType<typeof createSubscriptionContractManager>;
};

type Args = {
    choice: SubscriptionChoice;
    language: string;
    customerIdentifier: string;
};

export const createSubscriber =
    ({ crystallizeClient, subscriptionContractManager }: Deps) =>
    async ({ choice, customerIdentifier, language }: Args) => {
        const { path, plan, period, priceVariant, sku } = choice;
        const template = await subscriptionContractManager.createSubscriptionContractTemplateBasedOnVariantIdentity(
            path,
            {
                sku,
            },
            plan,
            period,
            priceVariant,
            language,
        );
        // we are going to be opinionated here and set the subscription to be active immediately
        // and with a custom renewal date in 3 days from now
        const inThreeDays = new Date();
        inThreeDays.setDate(inThreeDays.getDate() + 3);
        inThreeDays.setHours(23, 59, 59, 999);
        const { recurring, initial, ...rest } = template;
        await subscriptionContractManager.create({
            ...rest,
            ...(initial ? { initial } : {}),
            recurring,
            customerIdentifier,
            tenantId: crystallizeClient.config.tenantId!,
            status: {
                activeUntil: inThreeDays,
                price: template.initial?.price || template.recurring?.price || 0,
                currency: template.initial?.currency || template.recurring?.currency || 'EUR',
                renewAt: inThreeDays,
            },
        });
    };
