'use server'

import { createToken } from "@/core/auth.server";

export async function sendMagickLinkAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const token = await createToken(email);
    const link = `http://localhost:3000/magick-link/${token}`
    // @todo: send email here
    return link;
}
