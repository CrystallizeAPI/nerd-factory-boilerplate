export const SubscriptionStatus = () => {
    const renewalDateIsNotThere = false;
    const todayIsBeforeRenewalDate = true;
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
            <p className="text-sm font-semibold text-black/60">Will renew in X days</p>
        </div>
    );
};
