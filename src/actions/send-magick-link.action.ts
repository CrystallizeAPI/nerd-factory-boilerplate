'use server';

import { headers } from 'next/headers';
import { authenticator } from '@/core/di.server';

export async function sendMagickLinkAction(prevState: unknown, formData: FormData) {
    const headersList = await headers();
    const host = headersList.get('host');
    const email = formData.get('email') as string;
    const redirect = (formData.get('redirect') as string) || '/';
    const token = await authenticator.createToken(email);
    console.log(headersList.get('host'));

    if (host?.includes('localhost')) {
        return `http://${host}/magick-link/${token}?redirect=${redirect}`;
    }
    return `https://${host}/magick-link/${token}?redirect=${redirect}`;
}
