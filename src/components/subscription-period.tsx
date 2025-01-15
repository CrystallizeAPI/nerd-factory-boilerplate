import { priceFormatter } from './currency-formatter';
import { clsx } from 'clsx';
import { Bill } from '@/domain/contracts/bill';

type PeriodProps = {
    title: string;
    bill: Bill;
};
export function Period({ bill }: PeriodProps) {
    const phase = bill.phase;

    return (
        <div>
            {phase.meteredVariables && (
                <div>
                    {phase.meteredVariables.map((mv) => {
                        const usage = bill.variables[mv.identifier].usage;
                        const price = bill.variables[mv.identifier].price;

                        return (
                            <div key={mv.identifier} className="flex gap-4 px-6 pt-6 pb-4">
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
                                        return (
                                            <div
                                                key={`${mv.identifier}-${tier.threshold}`}
                                                className="flex items-center justify-between gap-6 w-full"
                                            >
                                                <div className="items-center gap-4 flex">
                                                    <span className="bg-black  w-auto h-6 px-2 flex items-center justify-center  text-white text-sm font-semibold rounded-lg">
                                                        {usage} {mv.unit.toLowerCase()}
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
                                                'max-w-24 ': isLastTier && !onlyOneTier,
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
                                                    '!bg-black': usage > nextTier?.threshold,
                                                })}
                                            >
                                                {usage > tier.threshold &&
                                                    usage < (nextTier?.threshold || Infinity) && (
                                                        <>
                                                            <span
                                                                className="bg-black absolute left-0 h-2 rounded-l"
                                                                style={{
                                                                    width: `${((usage - tier.threshold) / thresholdRange) * 100}%`,
                                                                }}
                                                            />
                                                            <span
                                                                className="bg-black absolute w-6 h-6 top-1 -translate-y-1/2 flex items-center justify-center  text-white text-sm font-semibold rounded-full"
                                                                style={{
                                                                    left: `${((usage - tier.threshold) / thresholdRange) * 100}%`,
                                                                }}
                                                            >
                                                                {usage}
                                                            </span>
                                                        </>
                                                    )}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div className="font-bold text-sm w-20 text-right  shrink-0 items-center flex justify-end">
                                    +{priceFormatter('eur', price)}
                                </div>
                            </div>
                        );
                    })}
                    <div
                        className={clsx('border-t border-black mt-8 px-6 pb-8', {
                            '!mt-0 !border-0': phase.meteredVariables.length === 0,
                        })}
                    >
                        <div className="grid grid-cols-2 text-sm font-medium  gap-y-1 pt-4 right-0 max-w-[50%] w-full mr-0 ml-auto mt-4">
                            <span>Base cost</span>
                            <span className="text-right font-bold">{priceFormatter('eur', phase.price)}</span>
                            <span>Metered cost</span>
                            <span className="text-right font-bold">
                                {priceFormatter('eur', bill.price - phase.price)}
                            </span>
                            <span>Current total for period</span>
                            <span className="text-right font-bold">{priceFormatter('eur', bill.price)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
