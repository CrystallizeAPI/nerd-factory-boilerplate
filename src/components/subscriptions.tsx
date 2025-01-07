import { subscriptionFetcher } from '@/core/di.server';
import SubscriptionTabs from './client/subscription-tabs';

type SubscriptionsProps = {
    path?: string;
};
export default async function Subscriptions({ path }: SubscriptionsProps) {
    const subscriptions = path
        ? await subscriptionFetcher.fetchSubscription(path)
        : await subscriptionFetcher.fetchSubscriptions();

    return <SubscriptionTabs subscriptions={subscriptions} />;
}
