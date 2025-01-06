import { clsx } from 'clsx';
import { SubscriptionContract as SubscriptionContractType } from '@crystallize/js-api-client';
import Image from 'next/image';
import { SubscriptionStatus } from './subscription-status';
import { Period } from './subscription-period';

const Statuses = ['active', 'initial', 'cancelled', 'paused'] as const;
type StatusType = (typeof Statuses)[number];

export const SubscriptionContract = ({ contract }: { contract: SubscriptionContractType }) => {
    const subscriptionStatus: StatusType = Statuses[(Math.random() * 4) | 0];
    return (
        <>
            <li className="block  border overflow-hidden border-black rounded-lg w-full">
                <details open className="w-full block">
                    <summary className="flex justify-between p-4">
                        <div className="flex gap-3 w-full">
                            <div className="w-13 shrink-0 aspect-square bg-yellow border border-black rounded-lg overflow-hidden relative p-1.5">
                                {/* Need to include ImageUrl on subscription create */}
                                <Image
                                    src="https://media.crystallize.com/subscription-masterclass/25/1/3/3/superapp_graduated.svg"
                                    alt="Subscription item image"
                                    className="w-full h-full object-contain"
                                    width={34}
                                    height={34}
                                />
                            </div>
                            <div className="">
                                <h3 className="font-bold text-lg">{contract.item.name}</h3>
                                <SubscriptionStatus />
                            </div>
                        </div>
                        <div className="flex items-start justify-end gap-4 w-full">
                            <p className="text-sm font-semibold text-black/60 pt-1">12.12.2024 - 12.01.2025</p>
                            <span
                                className={clsx('font-bold  py-1 text-sm px-4 rounded', {
                                    'bg-green-300 text-green-800': subscriptionStatus === 'active',
                                    'bg-blue-200 text-blue-800': subscriptionStatus === 'initial',
                                    'bg-red-200 text-red-800': subscriptionStatus === 'cancelled',
                                    'bg-orange-200 text-orange-800': subscriptionStatus === 'paused',
                                })}
                            >
                                {subscriptionStatus}
                            </span>
                        </div>
                    </summary>
                    <div className="py-8 bg-yellow border-0 border-t border-black">
                        <Period title="Recurring" phase={contract.recurring} />
                        {/* {contract.initial && (
              <div className="border-r-2 pr-2">
                <Period title="Initial" phase={contract.initial} />
              </div>
            )} */}
                    </div>
                </details>
            </li>

            {/* <div className="flex justify-between items-center">
        <TrackUsageOnSubscriptionIntentForm {...contract} />
        <ForceSubscriptionContractRenewIntentForm {...contract} />
      </div> */}
        </>
    );
};
