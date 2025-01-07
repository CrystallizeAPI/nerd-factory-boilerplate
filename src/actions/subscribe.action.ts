'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { authenticator, subscribe } from '@/core/di.server';

export async function subscribeAction(prevState: unknown, form: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;
    try {
        const payload = await authenticator.decodeToken(token || '');
        const sku = form.get('sku') as string;
        const customerIdentifier = payload.email;
        await subscribe({
            path: form.get('path') as string,
            sku,
            customerIdentifier,
            plan: form.get('plan') as string,
            period: form.get('period') as string,
            priceVariant: form.get('priceVariant') as string,
            language: 'en',
        });
    } catch (exception) {
        console.error(exception);
        redirect('/login');
    }
    redirect('/my/subscriptions');
}
