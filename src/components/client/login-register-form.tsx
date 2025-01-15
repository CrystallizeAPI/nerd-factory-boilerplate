'use client';

import { sendMagickLinkAction } from '@/actions/send-magick-link.action';
import { useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
export default function LoginOrRegisterForm({ redirect }: { redirect?: string }) {
    const [link, action, pending] = useActionState(sendMagickLinkAction, null);
    const [currentForm, setCurrentForm] = useState<'login' | 'register'>('login');

    return (
        <div className="block w-full">
            {link ? (
                <div className=" bg-yellow/30 p-12 rounded-xl border border-yellow">
                    <h2 className="text-black font-bold text-xl">Abracadabra!</h2>
                    <p className="text-lg">A magic link has appeared in your inbox—poof! ✨ Click it to log in 🚀</p>
                    <p className="border-t border-black/10 mt-4 pt-4">
                        Still no sign of it? Check your spam folder or click{' '}
                        <a className="text-black font-bold underline" href={link}>
                            here
                        </a>{' '}
                        to cheat the system.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex gap-2 py-2">
                        <button
                            className={clsx('font-medium text-black text-black/60', {
                                '!font-bold !text-black underline': currentForm === 'login',
                            })}
                            onClick={() => setCurrentForm('login')}
                        >
                            Login
                        </button>
                        <span className="text-black/60">/</span>
                        <button
                            className={clsx('font-medium text-black text-black/60', {
                                '!font-bold !text-black underline': currentForm === 'register',
                            })}
                            onClick={() => setCurrentForm('register')}
                        >
                            Create account
                        </button>
                    </div>
                    {currentForm === 'login' ? (
                        <Login redirect={redirect} action={action} pending={pending} />
                    ) : (
                        <CreateAccount redirect={redirect} action={action} pending={pending} />
                    )}
                </>
            )}
        </div>
    );
}

export const Login = ({
    redirect,
    action,
    pending,
}: {
    redirect?: string;
    action: (payload: FormData) => void;
    pending: boolean;
}) => {
    const searchParams = useSearchParams();

    return (
        <form action={action}>
            <div className="input-group rounded-2xl border w-full">
                <label className="input-label">Email</label>
                <input name="email" type="email" placeholder="batman@notbrucewayne.com" className="input-field" />
                <input name="redirect" type="hidden" value={searchParams.get('redirect') || redirect || '/'} />
            </div>

            <button
                type="submit"
                className="px-8 mt-6 block ml-auto mr-0  py-3 bg-black text-white font-bold  rounded-lg "
                disabled={pending}
            >
                Login
            </button>
        </form>
    );
};

export const CreateAccount = ({
    action,
    pending,
    redirect,
}: {
    redirect?: string;
    action: (payload: FormData) => void;
    pending: boolean;
}) => {
    const searchParams = useSearchParams();

    return (
        <form action={action}>
            <input name="redirect" type="hidden" value={searchParams.get('redirect') || redirect || '/'} />

            <div className="input-group rounded-t-2xl w-full">
                <label className="input-label">Email</label>
                <input name="email" type="email" placeholder="batman@notbrucewayne.com" className="input-field" />
            </div>
            <div className="input-group  w-full">
                <label className="input-label">First name</label>
                <input name="firstname" placeholder="Bruce" className="input-field" />
            </div>
            <div className="input-group rounded-b-2xl border-b w-full">
                <label className="input-label">Surname</label>
                <input name="surname" placeholder="Wayne" className="input-field" />
            </div>
            <button
                type="submit"
                className="px-8 mt-6 ml-auto mr-0 py-3 block bg-black text-white font-bold rounded-lg "
                disabled={pending}
            >
                Register
            </button>
        </form>
    );
};
