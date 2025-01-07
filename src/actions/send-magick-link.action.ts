'use server';

import { authenticator } from '@/core/di.server';

export async function sendMagickLinkAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const token = await authenticator.createToken(email);
    const link = `http://localhost:3000/magick-link/${token}`;
    // @todo: send email here
    return link;
}
