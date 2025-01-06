'use server';

import { decodeToken } from '@/core/auth.server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createSubscriptionContractManager } from '@crystallize/js-api-client';
import { container } from '@/core/container.server';

export async function subscribeAction(prevState: unknown, form: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth.token')?.value;
    try {
        const payload = await decodeToken(token || '');
        const sku = form.get('sku') as string;
        const customerIdentifier = payload.email;
        const manager = createSubscriptionContractManager(container.crystallizeClient);
        const template = await manager.createSubscriptionContractTemplateBasedOnVariantIdentity(
            form.get('path') as string,
            {
                sku,
            },
            form.get('plan') as string,
            form.get('period') as string,
            form.get('priceVariant') as string,
            'en',
        );

        // we are going to be opinionated here and set the subscription to be active immediately
        // and with a custom renewal date in 3 days from now
        const inThreeDays = new Date();
        inThreeDays.setDate(inThreeDays.getDate() + 3);
        inThreeDays.setHours(23, 59, 59, 999);
        const { recurring, initial, ...rest } = template;
        await manager.create({
            ...rest,
            ...(initial ? { initial } : {}),
            recurring,
            customerIdentifier,
            tenantId: container.crystallizeClient.config.tenantId!,
            status: {
                activeUntil: inThreeDays,
                price: template.initial?.price || template.recurring?.price || 0,
                currency: template.initial?.currency || template.recurring?.currency || 'EUR',
                renewAt: inThreeDays,
            },
        });
    } catch (exception) {
        console.error(exception);
        redirect('/login');
    }
    redirect('/my/subscriptions');
}
