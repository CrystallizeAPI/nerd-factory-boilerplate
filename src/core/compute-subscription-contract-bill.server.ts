import { ClientInterface, pricesForUsageOnTier, createSubscriptionContractManager, SubscriptionContract } from '@crystallize/js-api-client'
import { Period, periodForContract } from './period-for-contract.server'

type Deps = {
  client: ClientInterface
}

type Args = {
  contract: SubscriptionContract
  period?: Period['range']
}

export type Bill = {
  price: number
  currency: string
  range: Period['range']
  phase: SubscriptionContract['recurring'],
  variables: Record<
    string,
    {
      id: string
      usage: number
      price: number
    }
  >
}
export const computeContractBill = async ({ contract, period }: Args, { client }: Deps): Promise<Bill> => {
  const range = period ?? periodForContract(contract).range
  const manager = createSubscriptionContractManager(client)
  const [usage, phaseIdentifier] = await Promise.all([
    manager.getUsageForPeriod(contract.id, range.from, range.to),
    manager.getCurrentPhase(contract.id)
  ])

  const phase = contract[phaseIdentifier] || contract['recurring']
  const currency = phase.currency
  const basePrice = phase.price

  const priceUsage = phase.meteredVariables?.reduce(
    (
      memo: {
        total: number
        variables: Record<
          string,
          {
            id: string
            usage: number
            price: number
          }
        >
      },
      meteredVariable,
    ) => {
      const meteredVariableUsage = usage.find((u) => u.meteredVariableId === meteredVariable.id)?.quantity || 0
      const prices = pricesForUsageOnTier(
        meteredVariableUsage,
        meteredVariable.tiers,
        meteredVariable.tierType as 'volume' | 'graduated',
      )
      const price = prices[currency] ?? 0

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
      }
    },
    { total: basePrice, variables: {} },
  ) || { total: basePrice, variables: {} }

  return {
    currency,
    price: priceUsage.total,
    range,
    variables: priceUsage.variables,
    phase
  }
}
