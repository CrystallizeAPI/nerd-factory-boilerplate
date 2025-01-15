import {
    ClientInterface,
    pricesForUsageOnTier,
    createSubscriptionContractManager,
    SubscriptionContract,
} from '@crystallize/js-api-client';
import dayjs, { ManipulateType } from 'dayjs';
import { Period } from '../contracts/period';
import { Bill } from '../contracts/bill';

type Deps = {
    crystallizeClient: ClientInterface;
};

type Args = {
    contract: SubscriptionContract;
    period?: Period['range'];
};

const isValidPeriodUnit = (unit: string): unit is ManipulateType => ['year', 'month', 'day'].includes(unit);

const periodForContract = (contract: SubscriptionContract): Period => {
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

export const createContractBillComputer =
    ({ crystallizeClient }: Deps) =>
    async ({ contract, period }: Args): Promise<Bill> => {
        const range = period ?? periodForContract(contract).range;
        const manager = createSubscriptionContractManager(crystallizeClient);
        const [usage, phaseIdentifier] = await Promise.all([
            manager.getUsageForPeriod(contract.id, range.from, range.to),
            manager.getCurrentPhase(contract.id),
        ]);

        const phase = contract[phaseIdentifier] || contract['recurring'];
        const currency = phase.currency;
        const basePrice = phase.price;
        const priceUsage = phase.meteredVariables?.reduce(
            (
                memo: {
                    total: number;
                    variables: Record<
                        string,
                        {
                            id: string;
                            usage: number;
                            price: number;
                        }
                    >;
                },
                meteredVariable,
            ) => {
                const meteredVariableUsage =
                    usage.find((u) => u.meteredVariableId === meteredVariable.id)?.quantity || 0;
                const prices = pricesForUsageOnTier(
                    meteredVariableUsage,
                    meteredVariable.tiers,
                    meteredVariable.tierType as 'volume' | 'graduated',
                );
                const price = prices[currency] ?? 0;

                return {
                    total: memo.total + price,
                    variables: {
                        ...memo.variables,
                        [meteredVariable.identifier]: {
                            id: meteredVariable.id,
                            usage: meteredVariableUsage,
                            price: price,
                        },
                    },
                };
            },
            { total: basePrice, variables: {} },
        ) || { total: basePrice, variables: {} };

        return {
            currency,
            price: priceUsage.total,
            range,
            variables: priceUsage.variables,
            phase,
            phaseIdentifier,
        };
    };
