'use client';

import { subscribeAction } from '@/actions/subscribe.action';
import { useActionState } from 'react';

type SubscriptionContractIntent = {
    plan: {
        identifier: string,
        name: string,
    },
    period: {
        id: string,
        name: string,
    },
    priceVariant: {
        name: string,
        identifier: string,
        currency: string,
    },
    sku: string,
    path: string,
}


export function SubscriptionContractIntentForm(intent: SubscriptionContractIntent) {
    const [state, action, pending] = useActionState(subscribeAction, null)

    const { plan, period, priceVariant, sku, path } = intent
    return <form action={action} key={plan.identifier + period.id + priceVariant.identifier}>
        <input name='path' type='hidden' value={path} />
        <input name='sku' type='hidden' value={sku} />
        <input name='quantity' type='hidden' value='1' />
        <input name='priceVariant' type='hidden' value={priceVariant.identifier} />
        <input name='plan' type='hidden' value={plan.identifier} />
        <input name='period' type='hidden' value={period.id} />
        <button className='p-2 bg-amber-200 text-black rounded-lg w-80' type='submit' disabled={pending}>
            {plan.name} ({period.name})<br />{priceVariant.name} ({priceVariant.currency})<br />
            <small>{pending ? 'Contract is being created' : 'Subscribe!'}</small>
        </button>
    </form>

}
