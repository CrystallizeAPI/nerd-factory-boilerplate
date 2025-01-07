import dayjs from 'dayjs';
import { priceFormatter } from './currency-formatter';
import { Image } from '@crystallize/reactjs-components';
import { Order } from '@crystallize/js-api-client';

export const SubscriptionOrders = ({ order }: { order: Order & { reference: string } }) => {
    return (
        <details className="border border-black gap-2 rounded-lg [&_span]:open:-rotate-180 ">
            <summary className="flex justify-between px-6 py-4 w-full gap-8 ">
                <div className="flex gap-4 items-center">
                    <span>↓</span>
                    <p className="font-bold">{order.reference}</p>
                    <p>{dayjs(order.createdAt).format('DD.MM.YYYY')}</p>
                </div>
                <div className="font-bold">{priceFormatter(order.total?.currency, order.total?.gross)}</div>
            </summary>

            <ul className="bg-yellow  border-t border-black">
                {order.cart.map((item) => {
                    return (
                        <li key={item.sku} className="border-b border-black px-6">
                            <div className="flex">
                                <div>
                                    <Image src={item.imageUrl} alt={item.name} width={100} height={100} />
                                </div>
                                <div>
                                    {item.name} ({item.sku})<p> {item.quantity}</p>
                                </div>
                            </div>

                            {item.subscriptionContractId && (
                                <p>Subscription Contract ID: {item.subscriptionContractId}</p>
                            )}

                            {item.subscription && (
                                <div className="border border-black p-2">
                                    <strong>Subscription</strong>
                                    <br />
                                    <p>Name: {item.subscription.name}</p>
                                    <p>
                                        Period: {item.subscription.period} {item.subscription.unit}
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
                                                {item.subscription.meteredVariables.map((mv) => {
                                                    return (
                                                        <tr key={mv.id}>
                                                            <td>{mv.id}</td>
                                                            <td>{mv.usage}</td>
                                                            <td>{mv.price}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            <div>
                <p>
                    <strong>Total:</strong>
                </p>
            </div>
        </details>
    );
};
