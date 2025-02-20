import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { priceFormatter } from './currency-formatter';
import NextImage from 'next/image';
import { SubscriptionSlim } from '@/domain/contracts/subcription-slim';
import Link from 'next/link';
import { FORCED_PRICE_VARIANT, SubscriptionChoice } from '@/domain/contracts/subscription-choice';
import { encodeBase64Url } from '@/core/utils';

type SubscriptionVariantsProps = {
    subscription: SubscriptionSlim;
};

export function SubscriptionTabVariants({ subscription }: SubscriptionVariantsProps) {
    return (
        <ul className="flex gap-12 py-12 justify-center items-stretch">
            {subscription.variants.map((variant) => (
                <li
                    key={variant.sku}
                    className="border relative bg-yellow border-black rounded-lg text-center w-full overflow-hidden "
                >
                    <div className="px-12 py-12 bg-white border-b border-black">
                        <div className="flex justify-between">
                            <div></div>
                            {variant.firstImage && (
                                <div className="[&_img]:object-contain [&_img]:w-full [&_img]:h-full w-10 aspect-square rounded-lg bg-yellow border border-black p-1 relative translate-x-6 -translate-y-6">
                                    <Image
                                        {...variant.firstImage}
                                        key={variant.firstImage.key}
                                        alt={variant.name}
                                        className="w-full h-full"
                                    />
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-black text-left">{variant.name}</h3>
                        <div className="flex flex-col gap-2 justify-center">
                            {variant.subscriptionPlans.length === 0 && (
                                <div className="rounded-lg m-2 flex items-center text-center justify-center p-10 bg-red-100">
                                    <small>
                                        There is nothing to show.
                                        <br />
                                        <strong>
                                            Most likely you did not setup the Subscription Plan on each SKU!
                                        </strong>
                                        .
                                    </small>
                                </div>
                            )}
                            {variant.subscriptionPlans.flatMap((plan) => {
                                return plan.periods.flatMap((period) => {
                                    const priceVariant = period.recurring.priceVariants[FORCED_PRICE_VARIANT];
                                    const choice: SubscriptionChoice = {
                                        path: subscription.path,
                                        plan: plan.identifier,
                                        period: period.id,
                                        priceVariant: FORCED_PRICE_VARIANT,
                                        sku: variant.sku,
                                    };
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
                                                <Link
                                                    className="py-2.5 bg-black rounded-lg px-12 text-base text-white hover:bg-black/90"
                                                    prefetch={false}
                                                    href={encodeURI(
                                                        `/checkout/` + encodeBase64Url(JSON.stringify(choice)),
                                                    )}
                                                >
                                                    Buy now
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                    {variant.usp?.map((usp, uspIndex) => {
                        const { header, benefits } = usp.uniqueBenefits;
                        return (
                            <div className="py-12 px-12 bg-yellow text-left" key={`${variant.sku}-usp-${uspIndex}`}>
                                <h4 className="font-semibold text-base">{header}</h4>
                                {benefits?.length > 0 && (
                                    <ul className="flex flex-col gap-2 pt-4">
                                        {benefits.map((benefit, index) => (
                                            <li
                                                className="relative flex items-center gap-2"
                                                key={`${variant.sku}-benefit-${uspIndex}-${index}`}
                                            >
                                                <NextImage
                                                    src="/icon_checkmark.svg"
                                                    alt="Checkmark icon"
                                                    width={30}
                                                    height={30}
                                                />
                                                {benefit.valueProposition}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </li>
            ))}
        </ul>
    );
}
