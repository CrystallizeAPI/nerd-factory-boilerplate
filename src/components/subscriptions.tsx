import { container } from '@/core/container.server';
import { fetchSubscription, fetchSubscriptions } from '@/core/fetch-subscriptions.server';
import SubscriptionTabs from './client/subscription-tabs';

type SubscriptionsProps = {
    path?: string;
};
export default async function Subscriptions({ path }: SubscriptionsProps) {
    const subscriptions = path
        ? await fetchSubscription(path, { client: container.crystallizeClient })
        : await fetchSubscriptions({ client: container.crystallizeClient });

    return <SubscriptionTabs subscriptions={subscriptions} />;
}
