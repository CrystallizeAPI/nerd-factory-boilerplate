import { ClientInterface } from "@crystallize/js-api-client"
import { EnumType, jsonToGraphQLQuery } from 'json-to-graphql-query';

type Deps = {
  client: ClientInterface
}

export type Period = {
  month: number
  year: number
  range: {
    from?: Date
    to: Date
  }
}

export const fetchCurrentPhaseForContract = async (contractId: string, { client }: Deps,
): Promise<'initial' | 'recurring'> => {
  const query = {
    subscriptionContractEvent: {
      getMany: {
        __args: {
          subscriptionContractId: contractId,
          tenantId: client.config.tenantId,
          sort: new EnumType('asc'),
          first: 1,
          eventTypes: new EnumType('renewed'),
        },
        edges: {
          node: {
            id: true,
          }
        }
      },
    },
  }
  const contractUsage = await client.pimApi(jsonToGraphQLQuery({ query }))
  return contractUsage.subscriptionContractEvent.getMany.edges.length > 0 ? 'recurring' : 'initial'
}
