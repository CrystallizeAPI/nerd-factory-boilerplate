import Link from 'next/link';
import { cookies } from 'next/headers';
import { retrieveMeData } from '@/core/di.server';
import Image from 'next/image';

export default async function ConfirmationPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;
    let me = undefined;
    if (token) {
        const payload = token.split('.')[1];
        const { email } = JSON.parse(atob(payload));
        me = await retrieveMeData(email);
    }
    return (
        <div className="max-w-screen-xl mx-auto px-12 py-24 text-center flex justify-center items-center flex-col">
            <h1 className="text-6xl font-black text-black pb-6">Thank you, {me?.firstName}</h1>
            <p className="text-xl text-black max-w-screen-md mx-auto text-balance pb-12">
                Thank you for subscribing to NerdFactory! You&apos;re now part of our creative and tech-savvy community.
                Stay tuned for updates, exclusive content, and the latest innovations straight to your inbox.
            </p>
            <Link
                href="/my/subscriptions"
                className="py-2 px-6 text-sm text-black font-bold  flex gap-2  items-center float-right bg-black/5 rounded-lg m-2 hover:border-black border border-transparent"
            >
                <Image src="/icon_user.svg" alt="User icon" width={16} height={16} />
                My account
            </Link>
        </div>
    );
}
