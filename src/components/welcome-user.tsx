import Link from 'next/link';
import { cookies } from 'next/headers';
import { retrieveMeData } from '@/core/di.server';
import Image from 'next/image';
export default async function WelcomeUser() {
    // await new Promise((resolve) => setTimeout(resolve, 10000))
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;
    if (!token)
        return (
            <Link
                href="/login"
                className="py-2 px-6 font-medium text-sm text-white float-right bg-slate-800 rounded-lg m-2"
            >
                Login
            </Link>
        );
    const payload = token.split('.')[1];
    const { email } = JSON.parse(atob(payload));
    const me = await retrieveMeData(email);

    return (
        <Link
            className="py-2 px-6 text-sm text-black font-bold  flex gap-2  items-center float-right bg-black/5 rounded-lg m-2"
            href={'/my/subscriptions'}
        >
            <Image src="/icon_user.svg" alt="Account image" width={18} height={18} /> {me.firstName}
        </Link>
    );
}
