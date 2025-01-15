import NextImage from 'next/image';
import clsx from 'clsx';

export const CheckoutSteps = ({
    currentStep = 'account',
}: {
    currentStep: 'account' | 'persona' | 'payment' | 'done';
}) => {
    return (
        <div className="grid-cols-3 grid">
            <div
                className={clsx(
                    'flex items-center font-bold text-black gap-2 opacity-40 border-b-2 border-black pb-2',
                    {
                        '!opacity-100': currentStep === 'account',
                    },
                )}
            >
                <NextImage src="/icon_account.svg" alt="account icon" width={18} height={18} />
                Account
            </div>
            <div
                className={clsx(
                    'flex items-center font-bold opacity-40 text-black gap-2 border-b-2 border-black pb-2',
                    {
                        '!opacity-100': currentStep === 'persona',
                    },
                )}
            >
                <NextImage src="/icon_user.svg" alt="account icon" width={18} height={18} />
                Checkout
            </div>

            <div
                className={clsx(
                    'flex items-center opacity-40 font-bold text-black gap-2 border-b-2 border-black pb-2',
                    {
                        '!opacity-100': currentStep === 'done',
                    },
                )}
            >
                <NextImage src="/icon_checkmark.svg" alt="Success icon" width={18} height={18} />
                Done
            </div>
        </div>
    );
};
