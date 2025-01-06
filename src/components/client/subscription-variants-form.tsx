'use client';

import { subscribeAction } from '@/actions/subscribe.action';
import { useActionState } from 'react';

type SubscriptionContractIntent = {
    plan: {
        identifier: string;
        name: string;
    };
    period: {
        id: string;
        name: string;
    };
    priceVariant: {
        name: string;
        identifier: string;
        currency: string;
    };
    sku: string;
    path: string;
};

export function SubscriptionContractIntentForm(intent: SubscriptionContractIntent) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, action, pending] = useActionState(subscribeAction, null);

    const { plan, period, priceVariant, sku, path } = intent;
    return (
        <form action={action} key={plan.identifier + period.id + priceVariant.identifier}>
            <input name="path" type="hidden" value={path} />
            <input name="sku" type="hidden" value={sku} />
            <input name="quantity" type="hidden" value="1" />
            <input name="priceVariant" type="hidden" value={priceVariant.identifier} />
            <input name="plan" type="hidden" value={plan.identifier} />
            <input name="period" type="hidden" value={period.id} />
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
