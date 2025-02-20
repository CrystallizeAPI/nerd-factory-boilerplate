import LoginOrRegisterForm from '@/components/client/login-register-form';

export const revalidate = 60;

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
    const redirect = (await searchParams)?.redirect;
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h2 className="text-xl">Login</h2>
                <LoginOrRegisterForm redirect={redirect} />
            </main>
        </div>
    );
}
