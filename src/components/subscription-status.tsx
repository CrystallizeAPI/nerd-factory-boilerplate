import { SubscriptionContract as SubscriptionContractType } from '@crystallize/js-api-client';
import dayjs from 'dayjs';

export const SubscriptionStatus = ({ contract }: { contract: SubscriptionContractType }) => {
    const renewalDateIsNotThere = !contract.status.renewAt;
    const todayIsBeforeRenewalDate = true;

    const renewDate = dayjs(contract.status.renewAt);
    const daysUntilRewnew = renewDate.diff(dayjs(), 'day');

    // Subscription is cancelled
    if (renewalDateIsNotThere) {
        return (
            <div>
                {todayIsBeforeRenewalDate ? (
                    <p className="text-sm font-semibold text-orange-400">Subscription will end at XX.XX.XXXX</p>
                ) : (
                    <p className="text-sm font-semibold text-red-500">Subscription has ended</p>
                )}
            </div>
        );
    }
    return (
        <div>
            <p className="text-sm font-semibold text-black/60">Will renew in {daysUntilRewnew} days</p>
        </div>
    );
};
