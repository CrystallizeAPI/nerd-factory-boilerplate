import LoginOrRegisterForm from '@/components/client/login-register-form';
import { SubscriptionContractIntentForm } from '@/components/client/subscription-intent-form';
import { retrieveMeData, subscriptionFetcher } from '@/core/di.server';
import { decodeBase64Url } from '@/core/utils';
import { FORCED_PRICE_VARIANT, SubscriptionChoiceSchema } from '@/domain/contracts/subscription-choice';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { priceFormatter } from '@/components/currency-formatter';
import { CheckoutSteps } from '@/components/checkout-steps';
import { Image } from '@crystallize/reactjs-components';

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
        <>
            <div className="-mt-20 pt-20  bg-yellow">
                <div className="block w-full  gap-24 row-start-2 items-center sm:items-start max-w-screen-md mx-auto ">
                    <div className="flex flex-col gap-4 mb-24 tranform-y-20 top-10 relative">
                        <legend className="font-bold text-black mb-1">Subscription cart</legend>
                        <div className="flex justify-between border  bg-white border-black rounded-2xl py-3 px-4 gap-4 items-center">
                            <div className="[&_img]:object-contain [&_img]:w-full [&_img]:h-full w-14 h-14 block  aspect-square rounded-xl bg-yellow border border-black p-2 relative ">
                                <Image
                                    {...variant.firstImage}
                                    key={variant.firstImage.key}
                                    alt={variant.name}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="w-full flex justify-between">
                                <span>
                                    <strong className="text-lg">{variant.name}</strong> <br />
                                    <p className="text-sm text-black/60 font-medium">{variant.sku}</p>
                                </span>
                                <span>
                                    <strong>{priceFormatter(priceVariant.currency, priceVariant.price)}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                    <CheckoutSteps currentStep={me ? 'persona' : 'account'} />
                </div>
            </div>
            <div className="px-8 pb-20 gap-16 ">
                <div className="block w-full max-w-screen-md mx-auto ">
                    <div className="">
                        {me && (
                            <div>
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
                            </div>
                        )}
                        {!me && (
                            <div>
                                <div className="pt-20">
                                    <LoginOrRegisterForm redirect={`/checkout/${choiceParam}`} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
