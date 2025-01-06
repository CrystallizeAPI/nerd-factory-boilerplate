import Link from 'next/link';
import { cookies } from 'next/headers';

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
    return (
        <div className="p-3 text-white float-right bg-slate-800 rounded-lg m-2">
            <Link href={'/my/subscriptions'}>Welcome {email}</Link>
        </div>
    );
}
