import Subscriptions from '@/components/subscriptions';

export const revalidate = 60;

export default function Home() {
    return (
        <main>
            <div className="min-h-screen container mx-auto p-4">
                <Subscriptions />
            </div>
        </main>
    );
}
