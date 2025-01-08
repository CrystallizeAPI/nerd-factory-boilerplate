import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirect') || '/';
    const cookieStore = await cookies();
    cookieStore.delete('auth.token');
    redirect(redirectTo);
}
