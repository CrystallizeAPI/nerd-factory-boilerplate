import { subscriptionFetcher } from '@/core/di.server';
import SubscriptionTabs from './client/subscription-tabs';

type SubscriptionsProps = {
    path?: string;
};
export default async function Subscriptions({ path }: SubscriptionsProps) {
    const subscriptions = path
        ? await subscriptionFetcher.fetchSubscription(path)
        : await subscriptionFetcher.fetchSubscriptions();

    if ((Array.isArray(subscriptions) && subscriptions.length === 0) || !subscriptions) {
        return (
            <div className="flex items-center text-center justify-center p-10 bg-red-100 rounded-lg">
                <p>
                    <span className="text-2xl">There is nothing to show.</span>
                    <br />
                    <br />
                    <strong>Most likely you did not publish the Product from your tenant!</strong>.
                </p>
            </div>
        );
    }

    return <SubscriptionTabs subscriptions={subscriptions} />;
}
