import { decodeToken } from '@/core/auth.server';
import { container } from '@/core/container.server';
import { createCustomerIfNeeded } from '@/core/create-customer-if-needed.server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
    const token = (await params).token;
    try {
        const payload = await decodeToken(token);
        const cookieStore = await cookies();
        cookieStore.set('auth.token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        const [name, domain] = payload.email.split('@');
        const [host] = domain.split('.');
        await createCustomerIfNeeded(
            {
                email: payload.email,
                firstName: name.split('.')[0] || 'Unknown',
                lastName: name.split('.')[1] || 'Unknown',
                companyName: host.toUpperCase(),
            },
            {
                client: container.crystallizeClient,
            },
        );
    } catch {
        // console.error(error)
        return new Response(`Unauthorized.`, { status: 401 });
    }
    redirect('/');
}
