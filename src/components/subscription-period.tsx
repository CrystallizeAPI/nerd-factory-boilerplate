import { SubscriptionContract } from '@crystallize/js-api-client';

export function Period({ title, phase }: { title: string; phase: SubscriptionContract['recurring'] }) {
    return (
        <div className="px-6">
            {phase.meteredVariables && (
                <div className="border-gray-200" title={title}>
                    {phase.meteredVariables.map((mv) => {
                        return (
                            <div key={mv.identifier} className="flex gap-4">
                                <span className="text-sm font-semibold">{mv.name}</span>

                                {mv.tiers.map((tier, index) => {
                                    const nextTier = mv.tiers[index + 1];
                                    return (
                                        <div key={`${mv.identifier}-${tier.threshold}`} className="w-full">
                                            <div className="justify-between flex ">
                                                <span className="text-sm font-semibold">
                                                    {tier.threshold}
                                                    {nextTier ? `- ${nextTier.threshold}` : '+'}
                                                </span>
                                                <span className="text-sm font-semibold">
                                                    {tier.price} {tier.currency}
                                                </span>
                                            </div>
                                            <span className="w-full block bg-black h-2 rounded" />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
