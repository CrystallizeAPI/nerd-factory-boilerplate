import { container } from '@/core/container.server';
import { fetchSubscription, fetchSubscriptions, SubscriptionSlim } from '@/core/fetch-subscriptions.server';
import Link from 'next/link'
import { SubscriptionContractIntentForm } from './client/subscription-variants-form';

type SubscriptionsProps = {
    path?: string
}
export default async function Subscriptions({ path }: SubscriptionsProps) {
    const subscriptions = (path ? await fetchSubscription(path, { client: container.crystallizeClient }) : await fetchSubscriptions({ client: container.crystallizeClient }));

    if (Array.isArray(subscriptions)) {
        return <div>
            <ul>
                {subscriptions.map((subscription) => (
                    <li key={subscription.path} className='flex flex-col gap-2 p-4 border-2 border-gray-200 rounded-lg m-4'>
                        <Link className='text-center' href={`/subscriptions/${subscription.path}`}>{subscription.name}</Link>
                        <Variants subscription={subscription} />
                    </li>
                ))}
            </ul>
        </div>
    }

    if (!subscriptions) {
        return null;
    }
    return <Variants subscription={subscriptions} />
}

type SubscriptionVariantsProps = {
    subscription: SubscriptionSlim
}
function Variants({ subscription }: SubscriptionVariantsProps) {
    return <ul className='flex flex-row gap-2 items-center justify-center'>
        {subscription.variants.map((variant) => (
            <li key={variant.sku} className='p-4 border-2 border-gray-200 rounded-lg m-4 text-center'>
                {variant.name}
                <div className='flex flex-col gap-2 items-center justify-center'>
                    {variant.subscriptionPlans.flatMap((plan) => {
                        return plan.periods.flatMap((period) => {
                            const priceVariant = period.recurring.priceVariants;
                            return priceVariant.map((priceVariant) => {
                                return <SubscriptionContractIntentForm
                                    key={priceVariant.identifier}
                                    path={subscription.path}
                                    period={period}
                                    plan={plan}
                                    priceVariant={priceVariant}
                                    sku={variant.sku}
                                />
                            })
                        })
                    })}
                </div>
            </li>
        ))}
    </ul>
}
