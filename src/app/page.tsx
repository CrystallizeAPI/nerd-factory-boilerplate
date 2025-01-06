import Subscriptions from '@/components/subscriptions';

export const revalidate = 60;

export default function Home() {
    return (
        <main>
            <div className="min-h-screen container mx-auto p-4">
                <div className="flex flex-col gap-8 text-balance max-w-screen-md mx-auto text-center py-24">
                    <h1 className="text-6xl font-black">Your Ultimate Digital Companion</h1>
                    <p className="text-2xl">
                        All-in-one tools for work, life, and play. Subscribe now and unlock your superpowers.
                    </p>
                </div>
                <Subscriptions />
            </div>
        </main>
    );
}
