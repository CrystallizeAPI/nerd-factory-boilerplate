'use client';

import { forceSubscriptionContractRenewAction } from '@/actions/force-subscription-contract-renew.action';
import { EnrichedSubscriptionContract } from '@/core/fetch-user-subscriptions.server';
import { useActionState } from 'react';


export function ForceSubscriptionContractRenewIntentForm(contract: EnrichedSubscriptionContract) {
    const [state, action, pending] = useActionState(forceSubscriptionContractRenewAction, null)

    const { id } = contract
    return <form action={action} key={id}>
        <input name='id' type='hidden' value={id} />
        <button className='p-2 bg-red-200 text-black rounded-lg w-80' type='submit' disabled={pending}>
            <small>{pending ? 'Contract is being renewed' : 'Force Renew!'}</small>
        </button>
    </form>

}
