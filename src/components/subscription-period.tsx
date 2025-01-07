import { SubscriptionContract } from '@crystallize/js-api-client';
import { priceFormatter } from './currency-formatter';
import { clsx } from 'clsx';

export function Period({ title, phase }: { title: string; phase: SubscriptionContract['recurring'] }) {
    const dummyUsage = Math.floor(Math.random() * 30);
    return (
        <div>
            {phase.meteredVariables && (
                <div title={title}>
                    {phase.meteredVariables.map((mv) => {
                        let totalCost = 2 * dummyUsage;
                        return (
                            <div key={mv.identifier} className="flex gap-4 px-6">
                                <span className="text-sm font-semibold">{mv.name}</span>

                                {mv.tiers.map((tier, index) => {
                                    const nextTier = mv.tiers[index + 1];
                                    const isLastTier = index === mv.tiers.length - 1;
                                    const isFirstTier = index === 0;
                                    const onlyOneTier = mv.tiers.length === 1;
                                    const thresholdRange = isFirstTier
                                        ? nextTier?.threshold
                                        : nextTier?.threshold - tier.threshold;

                                    if (onlyOneTier) {
                                        totalCost = tier.price * dummyUsage;
                                        return (
                                            <div
                                                key={`${mv.identifier}-${tier.threshold}`}
                                                className="flex items-center justify-between gap-6 w-full"
                                            >
                                                <div className="items-center gap-4 flex">
                                                    <span className="bg-black  w-auto h-6 px-2 flex items-center justify-center  text-white text-sm font-semibold rounded-lg">
                                                        {dummyUsage} {mv.unit.toLowerCase()}
                                                    </span>
                                                    <span className="text-sm font-semibold">
                                                        {priceFormatter(tier.currency, tier.price)} / per{' '}
                                                        {mv.unit.toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={`${mv.identifier}-${tier.threshold}`}
                                            className={clsx('w-full', {
                                                'w-20 shrink-0': isLastTier && !onlyOneTier,
                                            })}
                                        >
                                            <div className="justify-between flex mb-2">
                                                <span className="text-sm font-semibold ">
                                                    {tier.threshold}
                                                    {nextTier ? ` - ${nextTier.threshold}` : '+'}
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    {priceFormatter(tier.currency, tier.price)}
                                                </span>
                                            </div>
                                            <span
                                                className={clsx('w-full relative block bg-black/30 h-2 rounded', {
                                                    '!bg-black': dummyUsage > nextTier?.threshold,
                                                })}
                                            >
                                                {dummyUsage > tier.threshold &&
                                                    dummyUsage < (nextTier?.threshold || Infinity) && (
                                                        <>
                                                            <span
                                                                className="bg-black absolute left-0 h-2 rounded-l"
                                                                style={{
                                                                    width: `${((dummyUsage - tier.threshold) / thresholdRange) * 100}%`,
                                                                }}
                                                            />
                                                            <span
                                                                className="bg-black absolute w-6 h-6 top-1 -translate-y-1/2 flex items-center justify-center  text-white text-sm font-semibold rounded-full"
                                                                style={{
                                                                    left: `${((dummyUsage - tier.threshold) / thresholdRange) * 100}%`,
                                                                }}
                                                            >
                                                                {dummyUsage}
                                                            </span>
                                                        </>
                                                    )}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div className="font-bold text-sm w-20 text-right  shrink-0 items-center flex justify-end">
                                    +{priceFormatter('eur', totalCost)}
                                </div>
                            </div>
                        );
                    })}
                    <div className="border-t border-black mt-8 px-6">
                        <div className="grid grid-cols-2 text-sm font-medium  gap-y-1 pt-4 right-0 max-w-[50%] w-full mr-0 ml-auto mt-4">
                            <span>Base cost</span>
                            <span className="text-right font-bold">{priceFormatter('eur', 19)}</span>
                            <span>Metered cost</span>
                            <span className="text-right font-bold">{priceFormatter('eur', 123)}</span>
                            <span>Current total for period</span>
                            <span className="text-right font-bold">{priceFormatter('eur', 123 + 19)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
