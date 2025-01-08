'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authenticator, subscribe } from '@/core/di.server';

export async function subscribeAction(prevState: unknown, form: FormData) {
    let redirectTo = '/my/subscriptions';
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;
    try {
        const payload = await authenticator.decodeToken(token || '');
        const sku = form.get('sku') as string;
        const customerIdentifier = payload.email;
        await subscribe({
            choice: {
                path: form.get('path') as string,
                sku,
                plan: form.get('plan') as string,
                period: form.get('period') as string,
                priceVariant: form.get('priceVariant') as string,
            },
            language: 'en',
            customerIdentifier,
        });
    } catch (exception) {
        console.error(exception);
        redirectTo = '/login';
    }
    // redirect cannot be done in try-catch block... as internally it does throw.... Next.js black magick
    redirect(redirectTo);
}
