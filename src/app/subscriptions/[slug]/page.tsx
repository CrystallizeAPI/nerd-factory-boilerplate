import Subscriptions from "@/components/subscriptions"
import { container } from "@/core/container.server"
import { fetchSubscriptions } from "@/core/fetch-subscriptions.server"

export const revalidate = 60

export async function generateStaticParams() {
    const subscriptions = await fetchSubscriptions({ client: container.crystallizeClient })
    return subscriptions.map((subscription) => ({
        slug: subscription.path.replace(/^\//, '') // remove the first slash here for next.js
    }))
}

export default async function SubscriptionPage({ params }: {
    params: Promise<{ slug: string }>
}) {
    const slug = '/' + (await params).slug
    return <Subscriptions path={slug} />
}
