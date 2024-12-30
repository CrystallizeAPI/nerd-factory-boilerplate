'use client';

import { EnrichedSubscriptionContract } from '@/core/fetch-user-subscriptions.server';
import { useActionState } from 'react';
import { trackUsageOnSubscriptionContractAction } from '@/actions/track-usage-on-subscription-contract.action';


export function TrackUsageOnSubscriptionIntentForm(contract: EnrichedSubscriptionContract) {
    const [state, action, pending] = useActionState(trackUsageOnSubscriptionContractAction, null)
    const { id } = contract

    if (!contract.subscriptionPlan.meteredVariables) {
        return null
    }
    return <form action={action} key={id} className='flex flex-col gap-2 border-2 border-gray-200 rounded-lg p-4 m-4'>
        <input name='id' type='hidden' value={id} />

        {contract.subscriptionPlan.meteredVariables.map((variable) => {
            return <div key={variable.id} className='flex flex-row gap-2'>
                <label>{variable.name}</label>
                <input name={`meteredVariables[${variable.id}]`} type='number' className='text-black' />
            </div>
        })}


        <button className='p-2 bg-red-200 text-black rounded-lg w-80' type='submit' disabled={pending}>
            <small>{pending ? 'Contract is being track' : 'Track!'}</small>
        </button>
    </form>

}
