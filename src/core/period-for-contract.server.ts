import dayjs, { ManipulateType } from 'dayjs';
import { SubscriptionContract } from '@crystallize/js-api-client';

export type Period = {
    month: number;
    year: number;
    range: {
        from: Date;
        to: Date;
    };
};

const isValidPeriodUnit = (unit: string): unit is ManipulateType => ['year', 'month', 'day'].includes(unit);

export const periodForContract = (contract: SubscriptionContract): Period => {
    const renewAt = dayjs(contract.status.renewAt);
    const periodCount = contract.recurring.period;
    const periodUnit = contract.recurring.unit;
    if (!isValidPeriodUnit(periodUnit)) {
        throw new Error(`periodUnit ${periodUnit} is not supported.`);
    }
    const date = renewAt.subtract(periodCount, periodUnit).toDate();
    return {
        range: {
            from: dayjs(date).toDate(),
            to: renewAt.toDate(),
        },
        month: dayjs(date).month() + 1,
        year: dayjs(date).year(),
    };
};
