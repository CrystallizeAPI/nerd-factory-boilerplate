'use client';
import { useState } from 'react';
import { clsx } from 'clsx';
import { SubscriptionTabVariants } from '../subscription-tabs-variants';
import { SubscriptionSlim } from '@/domain/contracts/subcription-slim';

export const SubscriptionTabs = ({
    subscriptions,
}: {
    subscriptions: SubscriptionSlim[] | SubscriptionSlim | undefined;
}) => {
    const [currentSubscription, setCurrentSubscription] = useState<SubscriptionSlim | undefined>(
        subscriptions ? (Array.isArray(subscriptions) ? subscriptions[0] : subscriptions) : undefined,
    );

    if (Array.isArray(subscriptions)) {
        return (
            <div>
                <ul className="flex border-b gap-14 border-gray-300 ">
                    {subscriptions.map((subscription) => (
                        <li key={subscription.path}>
                            <button
                                type="button"
                                className={clsx(
                                    'flex translate-y-0.5 pr-4 gap-4 text-left items-center py-4 border-b-2 border-transparent',
                                    {
                                        'border-black': subscription.path === currentSubscription?.path,
                                    },
                                )}
                                onClick={() => setCurrentSubscription(subscription)}
                            >
                                <span className="font-bold bg-yellow w-14  aspect-square rounded-xl"></span>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold">{subscription.name}</span>
                                    <span className="text-base font-medium text-black/80">
                                        {subscription.variants.length} subscriptions
                                    </span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
                {currentSubscription && <SubscriptionTabVariants subscription={currentSubscription} />}
            </div>
        );
    }

    if (!subscriptions) {
        return null;
    }
    return <SubscriptionTabVariants subscription={subscriptions} />;
};

export default SubscriptionTabs;
