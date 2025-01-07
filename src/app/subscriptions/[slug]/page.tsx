import Subscriptions from '@/components/subscriptions';
import { subscriptionFetcher } from '@/core/di.server';

export const revalidate = 60;

export async function generateStaticParams() {
    const subscriptions = await subscriptionFetcher.fetchSubscriptions();
    return subscriptions.map((subscription) => ({
        slug: subscription.path.replace(/^\//, ''), // remove the first slash here for next.js
    }));
}

export default async function SubscriptionPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = '/' + (await params).slug;
    return <Subscriptions path={slug} />;
}
