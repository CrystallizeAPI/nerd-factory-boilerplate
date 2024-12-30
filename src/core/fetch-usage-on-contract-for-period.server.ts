import { ClientInterface } from "@crystallize/js-api-client"
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

type Deps = {
  client: ClientInterface
}

export type Period = {
  month: number
  year: number
  range: {
    from: Date
    to: Date
  }
}

export const fetchUsageOnContractForPeriod = async (
  contractId: string,
  period: Period['range'],
  { client }: Deps,
): Promise<
  {
    meteredVariableId: string
    quantity: number
  }[]
> => {
  const query = {
    subscriptionContract: {
      get: {
        __args: {
          id: contractId,
        },
        id: true,
        usage: {
          __args: {
            start: period.from.toISOString(),
            end: period.to.toISOString(),
          },
          meteredVariableId: true,
          quantity: true,
        },
      },
    },
  }
  const contractUsage = await client.pimApi(jsonToGraphQLQuery({ query }))
  return contractUsage.subscriptionContract.get.usage
}
