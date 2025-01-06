import type { SubscriptionSlim } from '@/core/fetch-subscriptions.server';
import { SubscriptionContractIntentForm } from './client/subscription-variants-form';
import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { priceFormatter } from './currency-formatter';
import NextImage from 'next/image';

type SubscriptionVariantsProps = {
    subscription: SubscriptionSlim;
};

export function SubscriptionTabVariants({ subscription }: SubscriptionVariantsProps) {
    return (
        <ul className="flex gap-12 py-12 justify-center items-stretch ">
            {subscription.variants.map((variant) => (
                <li
                    key={variant.sku}
                    className="border relative border-black rounded-lg text-center w-full overflow-hidden"
                >
                    <div className="px-12 py-12">
                        <div className="flex justify-between">
                            <div></div>
                            <div className="w-10 aspect-square rounded-lg bg-yellow border border-black p-1 relative translate-x-6 -translate-y-6">
                                <Image
                                    {...variant.firstImage}
                                    key={variant.firstImage.key}
                                    alt={variant.name}
                                    className="object-fill w-full h-full"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-left">{variant.name}</h3>
                        <div className="flex flex-col gap-2 justify-center">
                            {variant.subscriptionPlans.flatMap((plan) => {
                                return plan.periods.flatMap((period) => {
                                    const FORCED_PRICE_VARIANT = 'default';
                                    const priceVariant = period.recurring.priceVariants[FORCED_PRICE_VARIANT];
                                    return (
                                        <div key={subscription.path} className="w-full">
                                            <div className="flex gap-2 items-baseline justify-start">
                                                <span className="text-4xl font-bold text-black">
                                                    {priceFormatter(priceVariant.currency, priceVariant.price)}
                                                </span>
                                                <span className="text-lg font-medium text-black/80">
                                                    {period.recurring.period === 1
                                                        ? `/ per ${period.recurring.unit}`
                                                        : `/ every ${period.recurring.period} ${period.recurring.unit}`}
                                                </span>
                                            </div>
                                            <div className="text-left text-black">
                                                {period.recurring?.meteredVariables?.length > 0 && (
                                                    <span className="text-sm font-bold text-black">+ usage</span>
                                                )}
                                            </div>
                                            <div className="text-left text-black text-base py-2">
                                                <ContentTransformer json={variant.description} />
                                            </div>
                                            <div className="flex justify-items-start w-full py-4">
                                                <SubscriptionContractIntentForm
                                                    key={FORCED_PRICE_VARIANT}
                                                    path={subscription.path}
                                                    period={period}
                                                    plan={plan}
                                                    priceVariant={{
                                                        identifier: FORCED_PRICE_VARIANT,
                                                        name: 'Default',
                                                        currency: priceVariant.currency,
                                                    }}
                                                    sku={variant.sku}
                                                />
                                            </div>
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                    <div className="py-12 px-12 bg-yellow border-t border-black text-left">
                        <h4 className="font-semibold text-base">Essential Benefits</h4>
                        <ul className="flex flex-col gap-2 pt-4">
                            <li className="flex items-center gap-2">
                                <NextImage src="/icon_checkmark.svg" alt="Checkmark icon" width={40} height={40} />
                                All-in-one solution for work and play.
                            </li>
                            <li className="flex items-center gap-2">
                                <NextImage src="/icon_checkmark.svg" alt="Checkmark icon" width={40} height={40} />
                                Sync on just enough devices (exactly two).
                            </li>
                            <li className="flex items-center gap-2">
                                <NextImage src="/icon_checkmark.svg" alt="Checkmark icon" width={40} height={40} />
                                Support that’s there… eventually.
                            </li>
                            <li className="flex items-center gap-2">
                                <NextImage src="/icon_checkmark.svg" alt="Checkmark icon" width={40} height={40} />
                                Affordable monthly price.
                            </li>
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    );
}
