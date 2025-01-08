import LoginForm from '@/components/client/login-form';
import { SubscriptionContractIntentForm } from '@/components/client/subscription-intent-form';
import { retrieveMeData, subscriptionFetcher } from '@/core/di.server';
import { decodeBase64Url } from '@/core/utils';
import { FORCED_PRICE_VARIANT, SubscriptionChoiceSchema } from '@/domain/contracts/subscription-choice';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function CheckoutPage({ params }: { params: Promise<{ choice: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;

    let me = undefined;
    if (token) {
        const payload = token.split('.')[1];
        const { email } = JSON.parse(atob(payload));
        me = await retrieveMeData(email);
    }
    const choiceParam = decodeURI((await params).choice);
    const choiceInput = JSON.parse(decodeBase64Url(choiceParam));
    const choiceResult = SubscriptionChoiceSchema.safeParse(choiceInput);

    if (!choiceResult.success) {
        return notFound();
    }
    const choice = choiceResult.data;
    const subscription = await subscriptionFetcher.fetchSubscription(choice.path);
    if (!subscription) {
        return notFound();
    }
    const variant = subscription.variants.find((variant) => variant.sku === choice.sku);
    if (!variant) {
        return notFound();
    }

    const plan = variant.subscriptionPlans.find((plan) => plan.identifier === choice.plan);
    if (!plan) {
        return notFound();
    }

    const period = plan.periods.find((period) => period.id === choice.period);
    if (!period) {
        return notFound();
    }

    const phase = period['initial'] || period['recurring'];
    if (!phase) {
        return notFound();
    }
    const priceVariant = phase.priceVariants[FORCED_PRICE_VARIANT];

    if (!priceVariant) {
        return notFound();
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h2 className="text-xl">Checkout</h2>

                {me && (
                    <SubscriptionContractIntentForm
                        sku={variant.sku}
                        path={choice.path}
                        subscription={subscription}
                        variant={variant}
                        plan={plan}
                        period={period}
                        priceVariant={{
                            ...priceVariant,
                            identifier: FORCED_PRICE_VARIANT,
                            name: 'Default',
                        }}
                        customer={me}
                    />
                )}

                {!me && (
                    <div>
                        <legend>Subscription</legend>
                        <p>
                            {subscription.name} - {variant.name} - {plan.name} - {period.name}
                        </p>
                        <p>
                            {priceVariant.currency} {priceVariant.price}
                        </p>
                        <hr />
                        <p>Please login to continue</p>
                        <LoginForm redirect={`/checkout/${choiceParam}`} />
                    </div>
                )}
            </main>
        </div>
    );
}
