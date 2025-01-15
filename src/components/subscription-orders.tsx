import dayjs from 'dayjs';
import { priceFormatter } from './currency-formatter';
import { Image } from '@crystallize/reactjs-components';
import { Order } from '@crystallize/js-api-client';

export const SubscriptionOrders = ({ order }: { order: Order & { reference: string } }) => {
    return (
        <details className="border border-black gap-2 rounded-lg [&_span]:open:-rotate-180 " open>
            <summary className="flex justify-between px-6 py-4 w-full gap-8 ">
                <div className="flex gap-4 items-center">
                    <span>↓</span>
                    <p className="font-bold">{order.reference}</p>
                    <p>{dayjs(order.createdAt).format('DD.MM.YYYY')}</p>
                </div>
                <div className="font-bold">{priceFormatter(order.total?.currency, order.total?.gross)}</div>
            </summary>

            <ul className="bg-yellow  border-t border-black">
                {order.cart.map((item, index) => {
                    return (
                        <li key={`${order.id}-${item.sku}-${index}`} className="py-2 px-6">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 shrink-0 flex h-12 aspect-square bg-white border border-black rounded-lg overflow-hidden relative p-1.5">
                                        {item.imageUrl && (
                                            <Image
                                                src={item.imageUrl}
                                                alt="Subscription item image"
                                                className="w-full h-full object-contain"
                                                width={34}
                                                height={34}
                                            />
                                        )}
                                    </div>
                                    <div className="shrink">
                                        <p className="font-bold text-base">{item.name}</p>
                                        <p className="text-black/60 text-sm italic">{item.sku}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <p className="font-medium">
                                        {priceFormatter(
                                            item.price?.currency || 'eur',
                                            item.price?.gross || 0 * item.quantity,
                                        )}
                                    </p>
                                    <p>x{item.quantity}</p>
                                </div>
                            </div>

                            {item.subscription && (
                                <div className="border border-black px-4 py-2 rounded-lg bg-white mt-2">
                                    <p className="text-base font-bold text-black">{item.subscription.name}</p>
                                    <div className="flex gap-2 items-center text-sm font-semibold text-black/60 ">
                                        <p>
                                            {item.subscription.period} {item.subscription.unit}
                                        </p>
                                        <div className="h-1 w-1 bg-black/30 block rounded-full"></div>
                                        <p> {dayjs(item.subscription.start).format('DD.MM.YYYY')} - </p>
                                        <p> {dayjs(item.subscription.end).format('DD.MM.YYYY')} </p>
                                    </div>

                                    {item.subscription.meteredVariables && (
                                        <div className="border-t border-black/20 mt-4">
                                            <div className="font-bold text-black/60  w-full grid-cols-3 grid gap-2 text-xs mt-4">
                                                <div>ID</div>
                                                <div>Usage</div>
                                                <div>Price</div>
                                            </div>
                                            {item.subscription.meteredVariables.map((mv) => {
                                                return (
                                                    <div key={mv.id} className="py-2 w-full grid-cols-3 grid gap-2 m">
                                                        <div>{mv.id}</div>
                                                        <div>{mv.usage}</div>
                                                        <div>{priceFormatter('eur', mv.price)} </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </details>
    );
};
