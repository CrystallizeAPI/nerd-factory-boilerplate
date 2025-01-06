'use client';

import { sendMagickLinkAction } from '@/actions/send-magick-link.action';
import { useActionState } from 'react';

export default function LoginForm() {
    const [link, action, pending] = useActionState(sendMagickLinkAction, null);
    return (
        <form className="flex flex-col gap-4 items-center" action={action}>
            <input
                name="email"
                type="email"
                placeholder="Email"
                className="p-4 border text-black border-gray-300 rounded-lg w-80"
            />
            <button type="submit" className="p-4 bg-amber-200 text-black rounded-lg w-80" disabled={pending}>
                Login
            </button>
            {link && (
                <div className="text-center text-sm">
                    <p className="text-yellow-500">
                        This is purely fake, that link should be sent into your email.
                        <br /> But for the sake of this livestream, you can just{' '}
                        <a className="text-xl text-cyan-300" href={link}>
                            click here
                        </a>
                    </p>
                </div>
            )}
        </form>
    );
}
