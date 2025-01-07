import { CreateOrderInputRequest, createOrderPusher, SubscriptionContract } from '@crystallize/js-api-client';
import { removeNullValue } from '../../core/utils';
import { Bill } from '../contracts/bill';

type Deps = {
    orderManager: {
        push: ReturnType<typeof createOrderPusher>;
    };
};

export const createOrderInstanciator =
    ({ orderManager }: Deps) =>
    async (contract: SubscriptionContract, bill: Bill) => {
        // we take the first currency of the grandtotal
        const netPrice = bill.price;
        const billingAddress =
            contract?.addresses?.find((address) => address.type.value === 'billing') ||
            contract?.customer?.addresses?.find((address) => address.type.value === 'billing') ||
            contract?.addresses?.[0] ||
            contract?.customer?.addresses?.[0];
        const taxRate = billingAddress && billingAddress.country?.toLowerCase() === 'norway' ? 0.25 : 0;
        const applyTax = (price: number) => {
            return price * (1 + taxRate);
        };

        // price is the same here, Order Item, Sub Total and Total
        const price = {
            gross: applyTax(netPrice),
            net: netPrice,
            currency: bill.currency,
            tax: {
                name: 'VAT',
                percent: taxRate * 100,
            },
        };

        const intent: CreateOrderInputRequest = {
            customer: {
                identifier: contract.customerIdentifier,
                ...(contract.customer && {
                    firstName: contract.customer.firstName,
                    lastName: contract.customer.lastName,
                    companyName: contract.customer.lastName,
                }),
                addresses: [
                    //@ts-expect-error - It's an enum in the API
                    removeNullValue({
                        ...billingAddress,
                        type: 'billing',
                    }),
                ],
            },
            cart: [
                {
                    quantity: 1,
                    name: contract.item.name,
                    sku: contract.item.sku,
                    price,
                    subTotal: price,
                    subscriptionContractId: contract.id,
                    subscription: {
                        name: contract.subscriptionPlan.name,
                        period: bill.phase.period,
                        //@ts-expect-error - It's an enum in the API
                        unit: bill.phase.unit,
                        start: bill.range.from,
                        end: bill.range.to,
                        meteredVariables: Object.keys(bill.variables).map((key) => {
                            const variable = bill.variables[key];
                            return {
                                id: variable.id,
                                usage: variable.usage,
                                price: applyTax(variable.price),
                            };
                        }),
                    },
                },
            ],
            total: price,
            meta: [{ key: 'email', value: contract.customer?.email || contract.customerIdentifier }],
        };
        return await orderManager.push(intent);
    };
