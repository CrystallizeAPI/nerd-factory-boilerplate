import { decodeToken } from "@/core/auth.server";
import { container } from "@/core/container.server";
import { fetchSubscriptionContractByCustomerIdentifier } from "@/core/fetch-user-subscriptions.server";
import { cookies } from "next/headers";

export default async function MySubscriptions() {
    // this could be put in a sub RSC and suspense to load faster
    const cookieStore = await cookies()
    const token = cookieStore.get('auth.token')?.value
    const payload = await decodeToken(token || '')
    const contracts = await fetchSubscriptionContractByCustomerIdentifier(payload.email, { client: container.crystallizeClient })
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1 className="text-2xl">My Subscriptions</h1>
                <ul>
                    {contracts.map((contract) => {
                        console.dir({ contract }, { depth: null })
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
                        </li>
                    })}
                </ul>
            </main>
        </div>
    );
}


type Phase = Awaited<ReturnType<typeof fetchSubscriptionContractByCustomerIdentifier>>[number]['initial' | 'recurring']

function Period({ title, phase }: {
    title: string
    phase: Phase
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
                {phase.meteredVariables.map((mv: Phase['meteredVariables']) => {
                    return <tr key={mv.identifier}>
                        <td>{mv.name}</td>
                        <td>{mv.unit}</td>
                        <td>{mv.tierType}</td>
                        <td>
                            <table>
                                <tbody>
                                    {mv.tiers.map((tier: Phase['meteredVariables']['tiers'][number]) => {
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
