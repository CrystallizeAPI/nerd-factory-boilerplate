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
import Link from 'next/link';
export default async function CheckoutPage({
    params,
    searchParams,
}: {
    params: Promise<{ choice: string }>;
    searchParams: { success: string };
}) {
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
    const checkoutSuccess = (await searchParams)?.success;

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
                    <CheckoutSteps currentStep={checkoutSuccess ? 'done' : me ? 'persona' : 'account'} />
                </div>
            </div>
            <div className="px-8 pb-20 gap-16 ">
                <div className="block w-full max-w-screen-md mx-auto ">
                    <div className="">
                        {checkoutSuccess && (
                            <div className="max-w-screen-xl mx-auto px-12 py-24 text-center flex justify-center items-center flex-col">
                                <h1 className="text-6xl font-black text-black pb-6">Thank you, {me?.firstName}</h1>
                                <p className="text-xl text-black max-w-screen-md mx-auto text-balance pb-12">
                                    Thank you for subscribing to NerdFactory! You’re now part of our creative and
                                    tech-savvy community. Stay tuned for updates, exclusive content, and the latest
                                    innovations straight to your inbox.
                                </p>
                                <Link
                                    href="/my/subscriptions"
                                    className="py-2 px-6 text-sm text-black font-bold  flex gap-2  items-center float-right bg-black/5 rounded-lg m-2 hover:border-black border border-transparent"
                                >
                                    <Image src="/icon_user.svg" alt="User icon" width={16} height={16} />
                                    My account
                                </Link>
                            </div>
                        )}
                        {me && !checkoutSuccess && (
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
                        {!me && !checkoutSuccess && (
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
