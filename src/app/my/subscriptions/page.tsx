import { authenticator, fetchMyAccountData } from '@/core/di.server';
import { cookies } from 'next/headers';
import { SubscriptionContract } from '../../../components/subscription-contract';

export default async function MySubscriptions() {
    // this could be put in a sub RSC and suspense to load faster
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;
    const payload = await authenticator.decodeToken(token || '');
    const { orders, contracts } = await fetchMyAccountData(payload.email);

    return (
        <div className="grid grid-cols-12 px-12  max-w-screen-xl mx-auto ">
            <main className="flex flex-col col-span-9 gap-8 m items-center sm:items-start">
                <h1 className="text-3xl font-semibold">Hey there 👋</h1>
                <div className="w-full">
                    <div>
                        <h2 className="text-sm font-bold text-black mb-2">Subscriptions</h2>
                        <ul className=" border w-full grid gap-3">
                            {contracts.map((contract) => {
                                return <SubscriptionContract contract={contract} key={contract.id} />;
                            })}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-black mb-2">Orders</h2>

                        <ul>
                            {orders.map((order) => {
                                return (
                                    <li key={order.id} className="p-4 border-2 border-gray-200 rounded-lg">
                                        <div className="flex flex-row gap-2">
                                            <div className="border-r-2 pr-2">
                                                <p>
                                                    <strong>Order ID:</strong> {order.id}
                                                </p>
                                                <p>
                                                    <strong>Order Created:</strong> {`${order.createdAt}`}
                                                </p>
                                                <p>
                                                    <strong>Order Reference:</strong> {order.reference}
                                                </p>
                                                <ul>
                                                    {order.cart.map((item) => {
                                                        return (
                                                            <li key={item.sku}>
                                                                <p>
                                                                    <strong>Item: </strong>
                                                                    {item.name} ({item.sku})
                                                                </p>
                                                                <p>Quantity: {item.quantity}</p>
                                                                {item.subscriptionContractId && (
                                                                    <p>
                                                                        Subscription Contract ID:{' '}
                                                                        {item.subscriptionContractId}
                                                                    </p>
                                                                )}
                                                                {item.subscription && (
                                                                    <div className="border-2 border-gray-200 p-2">
                                                                        <strong>Subscription</strong>
                                                                        <br />
                                                                        <p>Name: {item.subscription.name}</p>
                                                                        <p>
                                                                            Period: {item.subscription.period}{' '}
                                                                            {item.subscription.unit}
                                                                        </p>
                                                                        <p>Start: {`${item.subscription.start}`}</p>
                                                                        <p>End: {`${item.subscription.end}`}</p>
                                                                        {item.subscription.meteredVariables && (
                                                                            <table>
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>Name</th>
                                                                                        <th>Usage</th>
                                                                                        <th>Price</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {item.subscription.meteredVariables.map(
                                                                                        (mv) => {
                                                                                            return (
                                                                                                <tr key={mv.id}>
                                                                                                    <td>{mv.id}</td>
                                                                                                    <td>{mv.usage}</td>
                                                                                                    <td>{mv.price}</td>
                                                                                                </tr>
                                                                                            );
                                                                                        },
                                                                                    )}
                                                                                </tbody>
                                                                            </table>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            <div>
                                                <p>
                                                    <strong>Total:</strong> {order.total?.gross} {order.total?.currency}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
