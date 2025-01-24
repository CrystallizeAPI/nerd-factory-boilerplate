'use client';

import { sendMagickLinkAction } from '@/actions/send-magick-link.action';
import { useActionState, useState } from 'react';
import clsx from 'clsx';
import { Login } from '../login';
import { CreateAccount } from '../create-account';

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
