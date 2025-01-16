'use client';

import { subscribeAction } from '@/actions/subscribe.action';
import { encodeBase64Url } from '@/core/utils';
import { SubscriptionChoice } from '@/domain/contracts/subscription-choice';
import { SubscriptionContractIntent } from '@/domain/contracts/subscription-contract-intent';
import { useActionState, useState } from 'react';

import Image from 'next/image';

import clsx from 'clsx';
export function SubscriptionContractIntentForm(intent: SubscriptionContractIntent) {
    const [paymentMethod, setPaymentMethod] = useState('coin');
    const { plan, period, priceVariant, sku, path, customer } = intent;
    const choice: SubscriptionChoice = {
        path,
        plan: plan.identifier,
        period: period.id,
        priceVariant: priceVariant.identifier,
        sku,
    };
    const subscribeActionWithRedirect = subscribeAction.bind(null, {
        link: `/checkout/${encodeBase64Url(JSON.stringify(choice))}`,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, action, pending] = useActionState(subscribeActionWithRedirect, null);

    return (
        <form action={action} key={plan.identifier + period.id + priceVariant.identifier}>
            <input name="path" type="hidden" value={path} />
            <input name="sku" type="hidden" value={sku} />
            <input name="quantity" type="hidden" value="1" />
            <input name="priceVariant" type="hidden" value={priceVariant.identifier} />
            <input name="plan" type="hidden" value={plan.identifier} />
            <input name="period" type="hidden" value={period.id} />

            <fieldset className="flex flex-col mt-8">
                <legend className="text-sm font-bold text-black mb-2 flex items-center justify-between w-full">
                    Persona
                    <small className="float-end">
                        {customer?.identifier ? (
                            <a href={`/logout?redirect=/checkout/${encodeBase64Url(JSON.stringify(choice))}`}>
                                Not you ? Logout
                            </a>
                        ) : (
                            <a href={`/login?redirect=/checkout/${encodeBase64Url(JSON.stringify(choice))}`}>
                                Already have an account? Login
                            </a>
                        )}
                    </small>
                </legend>
                <div className={clsx('input-group', 'rounded-t-2xl')}>
                    <label htmlFor="email" className={'input-label'}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={'input-field'}
                        required
                        defaultValue={customer?.email || customer?.identifier}
                    />
                </div>
                <div className="grid grid-cols-2">
                    <div className={'input-group'}>
                        <label htmlFor="firstName" className={'input-label'}>
                            First name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            className={'input-field'}
                            required
                            defaultValue={customer?.firstName}
                        />
                    </div>
                    <div className={clsx('input-group', 'border-l-0')}>
                        <label htmlFor="lastName" className={'input-label'}>
                            Surname
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            className={'input-field'}
                            required
                            defaultValue={customer?.lastName}
                        />
                    </div>
                </div>

                <div className={'input-group'}>
                    <label htmlFor="phone" className={'input-label'}>
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="91 00 88 99"
                        className={'input-field'}
                        defaultValue={customer?.phone}
                    />
                </div>
                <div className={'input-group'}>
                    <label htmlFor="street" className={'input-label'}>
                        Address line
                    </label>
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        className={'input-field'}
                        defaultValue={customer?.addresses?.[0]?.street}
                    />
                </div>
                <div className={'input-group'}>
                    <label htmlFor="street2" className={'input-label'}>
                        Address line 2
                    </label>
                    <input
                        type="text"
                        name="street2"
                        placeholder="Apt, suite, unit number, etc (optional)"
                        className={'input-field'}
                        defaultValue={customer?.addresses?.[0]?.street2}
                    />
                </div>
                <div className="grid grid-cols-3">
                    <div className={'input-group'}>
                        <label htmlFor="postalCode" className={'input-label'}>
                            Zip code / Postal code
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="Postal code"
                            className={'input-field'}
                            defaultValue={customer?.addresses?.[0]?.postalCode}
                        />
                    </div>
                    <div className={clsx('input-group', 'col-span-2 border-l-0')}>
                        <label htmlFor="city" className={'input-label'}>
                            City
                        </label>

                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            className={'input-field'}
                            defaultValue={customer?.addresses?.[0]?.city}
                        />
                    </div>
                </div>

                <div className={clsx('input-group', '!border-b rounded-b-2xl')}>
                    <label htmlFor="country" className={'input-label'}>
                        Country
                    </label>

                    <input
                        type="text"
                        name="country"
                        className={'input-field'}
                        placeholder="Country"
                        defaultValue={customer?.addresses?.[0]?.country}
                    />
                </div>
            </fieldset>

            <fieldset className="flex flex-col mt-8">
                <legend className="text-sm font-bold text-black mb-2">Payment</legend>
                <PaymentProvider
                    title="Pay with Crystal Coin"
                    logoUrl="/logo_crystalcoin.svg"
                    identifier="coin"
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    pending={pending}
                />
                <PaymentProvider
                    title="Pay with Crystal Card"
                    logoUrl="/logo_crystalcard.svg"
                    identifier="card"
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    pending={pending}
                />
            </fieldset>
        </form>
    );
}

const PaymentProvider = ({
    title,
    logoUrl,
    identifier,
    paymentMethod,
    setPaymentMethod,
    pending,
}: {
    title: string;
    logoUrl: string;
    identifier: string;
    paymentMethod: string;
    setPaymentMethod: (value: string) => void;
    pending: boolean;
}) => {
    return (
        <div
            className="border rounded-t-2xl last:!rounded-t-none last:rounded-b-2xl first:border-b-0 last:border-t-0 border-black  gap-4  cursor-pointer hover:bg-gray-50 overflow-hidden"
            onClick={() => setPaymentMethod(identifier)}
        >
            <div className="w-full border justify-between flex px-6 py-6">
                <div className="flex gap-4 w-full">
                    <span className="rounded-full border min-w-6 h-6 mt-0.5 border-black flex items-center justify-center">
                        {paymentMethod === identifier && (
                            <span className="h-3 w-3 bg-black rounded-full block relative" />
                        )}
                    </span>
                    <h3 className="font-bold">
                        {title}
                        <small className="block font-medium text-sm">Your Crystallize wallet will be used</small>
                    </h3>
                </div>
                <div>
                    <Image src={logoUrl} alt="Crystal card logo" width={140} height={20} />
                </div>
            </div>
            {paymentMethod === identifier && (
                <div className="px-6 py-6 bg-yellow flex justify-between items-center">
                    <p className="text-sm">
                        <i>No real transactions will happen, this is just for demo purposes</i>
                    </p>
                    <button
                        className="py-2.5 bg-black rounded-lg px-12 text-base text-white hover:bg-black/90"
                        type="submit"
                        disabled={pending}
                    >
                        {pending ? 'Processing...' : `Pay with ${identifier}`}
                    </button>
                </div>
            )}
        </div>
    );
};
