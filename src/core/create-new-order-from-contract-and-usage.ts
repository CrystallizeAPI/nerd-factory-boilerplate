import { ClientInterface, CreateOrderInputRequest, createOrderPusher } from '@crystallize/js-api-client'
import { EnrichedSubscriptionContract } from './fetch-user-subscriptions.server'
import { Bill } from './compute-subscription-contract-bill.server'

type Deps = {
  client: ClientInterface
}

export const createNewOrderFromContractAndUsage = async (
  contract: EnrichedSubscriptionContract,
  bill: Bill,
  { client }: Deps,
) => {
  // we take the first currency of the grandtotal
  const netPrice = bill.price
  const billingAddress = contract.customer.addresses.find((address) => address.type === 'billing')
  const taxRate = billingAddress && billingAddress.country?.toLowerCase() === 'norway' ? 0.25 : 0
  const applyTax = (price: number) => {
    return price * (1 + taxRate)
  }

  // price is the same here, Order Item, Sub Total and Total
  const price = {
    gross: applyTax(netPrice),
    net: netPrice,
    currency: bill.currency,
    tax: {
      name: 'VAT',
      percent: taxRate * 100,
    },
  }

  const intent: CreateOrderInputRequest = {
    customer: {
      identifier: contract.customerIdentifier,
      firstName: contract.customer.firstName,
      lastName: contract.customer.lastName,
      companyName: contract.customer.lastName,
      addresses: [
        //@ts-ignore
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
          // @ts-ignore
          unit: bill.phase.unit,
          start: bill.range.from,
          end: bill.range.to,
          meteredVariables: Object.keys(bill.variables).map((key) => {
            const variable = bill.variables[key]
            return {
              id: variable.id,
              usage: variable.usage,
              price: applyTax(variable.price),
            }
          }),
        },
      },
    ],
    total: price,
    meta: [{ key: 'email', value: contract.customer.email }],
  }
  const orderPusher = createOrderPusher(client)
  return await orderPusher(intent)
}


const removeNullValue = <T>(obj: T): T | undefined => {
  if (obj === null || obj === undefined) {
    return undefined
  }

  if (Array.isArray(obj)) {
    const filtered = obj.map(removeNullValue).filter((val) => val !== undefined)
    return filtered.length === 0 ? ([] as T) : (filtered as unknown as T)
  }

  if (obj instanceof Date) {
    return obj
  }

  if (typeof obj === 'object') {
    const filtered: { [key: string]: unknown } = {}
    let empty = true
    for (const key in obj) {
      const val = removeNullValue(obj[key])
      if (val !== undefined) {
        empty = false
        filtered[key] = val
      }
    }
    return empty ? undefined : (filtered as unknown as T)
  }

  return obj
}
