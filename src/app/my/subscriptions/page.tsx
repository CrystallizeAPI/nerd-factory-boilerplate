import { authenticator, fetchMyAccountData } from '@/core/di.server';
import { cookies } from 'next/headers';
import { SubscriptionContract } from '../../../components/subscription-contract';
import { SubscriptionOrders } from '../../../components/subscription-orders';
import Link from 'next/link';
export default async function MySubscriptions() {
    // this could be put in a sub RSC and suspense to load faster
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;
    const payload = await authenticator.decodeToken(token || '');
    const { orders, contracts } = await fetchMyAccountData(payload.email);

    const openOrCloseSubscriptionContracts = contracts?.length < 3;

    return (
        <div className="w-full px-12  py-24 max-w-screen-xl mx-auto ">
            <main className="w-full  gap-8 m items-center sm:items-start">
                <h1 className="text-3xl font-semibold mb-8">Hey there 👋</h1>
                <div className="w-full grid grid-cols-12 gap-12">
                    <div className="col-span-9">
                        <h2 className="text-sm font-bold text-black mb-2">Subscriptions</h2>
                        <ul className=" w-full grid gap-4">
                            {contracts.map((contract) => {
                                return (
                                    <SubscriptionContract
                                        contract={contract}
                                        key={contract.id}
                                        openOrCloseSubscriptionContracts={openOrCloseSubscriptionContracts}
                                    />
                                );
                            })}
                        </ul>
                        <div className="py-24 flex flex-col gap-2">
                            <h2 className="text-sm font-bold text-black mb-2">Order history</h2>
                            {orders.map((order) => {
                                return <SubscriptionOrders order={order} key={order.id} />;
                            })}
                        </div>
                    </div>

                    <div className="col-span-3 ">
                        <h2 className="text-sm font-bold text-black mb-2">Profile</h2>
                        <div className="flex flex-col gap-4">
                            <p>Didrik Englund Hegna</p>
                            <p>
                                40 61 23 45 <br />
                                didrik@crystallize.com
                            </p>
                            <p>
                                Borgeåsvegen 8, <br /> 3910 Porsgrunn, <br /> Norway
                            </p>
                        </div>
                        <div className="inline-flex flex-col gap-4 mt-8">
                            <Link
                                href="/"
                                className="bg-black/10 hover:border-black border border-transparent flex items-center gap-2 py-1 pl-2 pr-4 rounded-lg text-sm font-semibold"
                            >
                                <img src="/icon_edit.svg" alt="Pencil icon" />
                                Edit profile
                            </Link>
                            <Link
                                href="/"
                                className="bg-black/10 inline hover:border-black border border-transparent flex items-center gap-2 py-1 pl-2 pr-4 rounded-lg text-sm font-semibold"
                            >
                                <img src="/icon_sign_out.svg" alt="Left facing arrow" />
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
