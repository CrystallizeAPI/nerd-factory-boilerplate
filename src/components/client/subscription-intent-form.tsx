'use client';

import { subscribeAction } from '@/actions/subscribe.action';
import { encodeBase64Url } from '@/core/utils';
import { SubscriptionChoice } from '@/domain/contracts/subscription-choice';
import { SubscriptionContractIntent } from '@/domain/contracts/subscription-contract-intent';
import { useActionState } from 'react';

import clsx from 'clsx';
export function SubscriptionContractIntentForm(intent: SubscriptionContractIntent) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, action, pending] = useActionState(subscribeAction, null);
    const { plan, period, priceVariant, sku, path, subscription, variant, customer } = intent;
    const choice: SubscriptionChoice = {
        path,
        plan: plan.identifier,
        period: period.id,
        priceVariant: priceVariant.identifier,
        sku,
    };

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
                        defaultValue={customer?.addresses?.[0].street}
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
                        defaultValue={customer?.addresses?.[0].street2}
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
                            defaultValue={customer?.addresses?.[0].postalCode}
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
                            defaultValue={customer?.addresses?.[0].city}
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
                        defaultValue={customer?.addresses?.[0].country}
                    />
                </div>
            </fieldset>
            <fieldset className="flex flex-col gap-4 mt-8">
                <legend className="text-sm font-bold text-black mb-2">Payment</legend>
                <div className="px-6 py-8 border rounded-2xl border-black">
                    <p>
                        Your Crystallize Wallet will be used! Careful payment work on 50% of the time. (so you can demo
                        the pipeline)
                    </p>
                </div>
            </fieldset>

            <button
                className="py-2.5 bg-black rounded-lg px-12 text-base text-white hover:bg-black/90"
                type="submit"
                disabled={pending}
            >
                {pending ? 'Contract is being created' : 'Buy now'}
            </button>
        </form>
    );
}
