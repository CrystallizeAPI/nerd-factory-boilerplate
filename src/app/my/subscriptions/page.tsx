import { ForceSubscriptionContractRenewIntentForm } from "@/components/client/force-subscription-renew-form";
import { TrackUsageOnSubscriptionIntentForm } from "@/components/client/track-usage-on-subscription-form";
import { decodeToken } from "@/core/auth.server";
import { container } from "@/core/container.server";
import { EnrichedPhase, fetchSubscriptionContractByCustomerIdentifier } from "@/core/fetch-user-subscriptions.server";
import { createOrderFetcher, Order } from "@crystallize/js-api-client";
import { create } from "domain";
import { cookies } from "next/headers";

export default async function MySubscriptions() {
    // this could be put in a sub RSC and suspense to load faster
    const cookieStore = await cookies()
    const token = cookieStore.get('auth.token')?.value
    const payload = await decodeToken(token || '')
    const orderFetcher = createOrderFetcher(container.crystallizeClient)
    const [contracts, orderResults] = await Promise.all([
        fetchSubscriptionContractByCustomerIdentifier(payload.email, { client: container.crystallizeClient }),
        orderFetcher.byCustomerIdentifier(payload.email, undefined, undefined, {
            subscriptionContractId: true,
            subscription: {
                start: true,
                end: true,
                name: true,
                period: true,
                unit: true,
                meteredVariables: {
                    id: true,
                    usage: true,
                    price: true
                }
            }
        }, {
            reference: true
        })
    ])
    const orders = orderResults.orders as Array<Order & { reference: string }>
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-2xl">My Account</h1>

                <div className="flex flex-row gap-2">
                    <div>
                        <h2 className="text-xl">My Subscriptions</h2>
                        <ul>
                            {contracts.map((contract) => {
                                return <li key={contract.id} className="p-4 border-2 border-gray-200 rounded-lg m-4">
                                    <div className="flex flex-row gap-2">
                                        <div className="border-r-2 pr-2">
                                            <p><strong>Contract ID:</strong> {contract.id}</p>
                                            <p><strong>Contract Plan:</strong> {contract.subscriptionPlan.name}</p>
                                            <p><strong>SKU:</strong> {contract.item.name} ({contract.item.sku})</p>
                                        </div>
                                        <div>
                                            <p><strong>Renewal at:</strong> {contract.status.renewAt}</p>
                                            <p><strong>Active Until:</strong> {contract.status.activeUntil}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 p-4 border-2 border-gray-200 rounded-lg m-4">
                                        {contract.initial && <div className="border-r-2 pr-2">
                                            <Period title="Initial" phase={contract.initial} />
                                        </div>}
                                        <div className="">
                                            <Period title="Recurring" phase={contract.recurring} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <TrackUsageOnSubscriptionIntentForm {...contract} />
                                        <ForceSubscriptionContractRenewIntentForm {...contract} />
                                    </div>

                                </li>
                            })}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl">My Orders</h2>
                        <ul>
                            {orders.map((order) => {
                                return <li key={order.id} className="p-4 border-2 border-gray-200 rounded-lg m-4">
                                    <div className="flex flex-row gap-2">
                                        <div className="border-r-2 pr-2">
                                            <p><strong>Order ID:</strong> {order.id}</p>
                                            <p><strong>Order Created:</strong> {`${order.createdAt}`}</p>
                                            <p><strong>Order Reference:</strong> {order.reference}</p>
                                            <ul>
                                                {order.cart.map((item) => {
                                                    return <li key={item.sku}>
                                                        <p><strong>Item: </strong>{item.name} ({item.sku})</p>
                                                        <p>Quantity: {item.quantity}</p>
                                                        {item.subscriptionContractId && <p>Subscription Contract ID: {item.subscriptionContractId}</p>}
                                                        {item.subscription && <div className="border-2 border-gray-200 p-2">
                                                            <strong>Subscription</strong><br />
                                                            <p>Name: {item.subscription.name}</p>
                                                            <p>Period: {item.subscription.period} {item.subscription.unit}</p>
                                                            <p>Start: {`${item.subscription.start}`}</p>
                                                            <p>End: {`${item.subscription.end}`}</p>
                                                            {item.subscription.meteredVariables && <table>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Usage</th>
                                                                        <th>Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.subscription.meteredVariables.map((mv) => {
                                                                        return <tr key={mv.id}>
                                                                            <td>{mv.id}</td>
                                                                            <td>{mv.usage}</td>
                                                                            <td>{mv.price}</td>
                                                                        </tr>
                                                                    })}
                                                                </tbody>
                                                            </table>}
                                                        </div>}
                                                    </li>
                                                })}
                                            </ul>
                                        </div>
                                        <div>
                                            <p><strong>Total:</strong> {order.total?.gross} {order.total?.currency}</p>
                                        </div>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}


function Period({ title, phase }: {
    title: string
    phase: EnrichedPhase
}
) {
    return <div className="">
        <p><strong>{title}</strong></p>
        <p><strong>Period:</strong> {phase.period} {phase.unit}</p>
        <p><strong>Price:</strong> {phase.price} {phase.currency}</p>

        {phase.meteredVariables && <table className="border-t-2 border-gray-200">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Pricing</th>
                    <th>Tiers</th>
                </tr>
            </thead>
            <tbody>
                {phase.meteredVariables.map((mv) => {
                    return <tr key={mv.identifier}>
                        <td>{mv.name}</td>
                        <td>{mv.unit}</td>
                        <td>{mv.tierType}</td>
                        <td>
                            <table>
                                <tbody>
                                    {mv.tiers.map((tier) => {
                                        return <tr key={`${mv.identifier}-${tier.threshold}`}>
                                            <td>Threshold: {tier.threshold}</td>
                                            <td>Price: {tier.price}</td>
                                            <td>Currency: {tier.currency}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>}
    </div>
}
