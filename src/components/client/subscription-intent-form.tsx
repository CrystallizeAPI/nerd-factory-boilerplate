'use client';

import { subscribeAction } from '@/actions/subscribe.action';
import { encodeBase64Url } from '@/core/utils';
import { SubscriptionChoice } from '@/domain/contracts/subscription-choice';
import { SubscriptionContractIntent } from '@/domain/contracts/subscription-contract-intent';
import { useActionState } from 'react';

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
            <fieldset className="flex flex-col gap-4 m-4">
                <legend>Subscription</legend>
                <p>
                    {subscription.name} - {variant.name} - {plan.name} - {period.name}
                </p>
                <p>
                    {priceVariant.currency} {priceVariant.price}
                </p>
            </fieldset>
            <fieldset className="flex flex-col gap-4 m-4">
                <legend className="flex items-center gap-4">
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
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    defaultValue={customer?.email || customer?.identifier}
                />
                <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    required
                    defaultValue={customer?.firstName}
                />
                <input type="text" name="lastName" placeholder="Last name" required defaultValue={customer?.lastName} />
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    defaultValue={customer?.addresses?.[0].country}
                />
                <input type="text" name="city" placeholder="City" defaultValue={customer?.addresses?.[0].city} />
                <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal code"
                    defaultValue={customer?.addresses?.[0].postalCode}
                />
                <input type="text" name="street" placeholder="Street" defaultValue={customer?.addresses?.[0].street} />
                <input
                    type="text"
                    name="street2"
                    placeholder="Street2"
                    defaultValue={customer?.addresses?.[0].street2}
                />
                <input type="text" name="phone" placeholder="Phone" defaultValue={customer?.phone} />
            </fieldset>
            <>
                <fieldset className="flex flex-col gap-4 m-4">
                    <legend>Payment</legend>

                    <p>
                        Your Crystallize Wallet will be used! Careful payment work on 50% of the time. (so you can demo
                        the pipeline)
                    </p>
                </fieldset>

                <button
                    className="py-2.5 bg-black rounded-lg px-12 text-base text-white hover:bg-black/90"
                    type="submit"
                    disabled={pending}
                >
                    {pending ? 'Contract is being created' : 'Buy now'}
                </button>
            </>
        </form>
    );
}
