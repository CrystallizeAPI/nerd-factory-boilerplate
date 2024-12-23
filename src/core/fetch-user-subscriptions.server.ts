/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientInterface } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export const enrichMeteredVariables = (contract: any): any => {
  const definition: Record<string, any> =
    contract.subscriptionPlan?.meteredVariables?.reduce((accumulator: any, variable: any) => {
      accumulator[variable.id] = variable;
      return accumulator;
    }, {}) ?? [];

  const enrichedRecurring = {
    ...contract.recurring,
    meteredVariables:
      contract.recurring?.meteredVariables?.map((variable: any) => {
        return {
          ...variable,
          ...definition[variable.id],
        };
      }) ?? [],
  };

  if (!contract.initial) {
    return {
      ...contract,
      recurring: enrichedRecurring,
    };
  }

  return {
    ...contract,
    initial: {
      ...contract.initial,
      meteredVariables:
        contract.initial?.meteredVariables?.map((variable: any) => {
          return {
            ...variable,
            ...definition[variable.id],
          };
        }) ?? [],
    },
    recurring: enrichedRecurring,
  };
};

const nodeQuery = () => {
  return {
    id: true,
    customerIdentifier: true,
    customer: {
      email: true,
      firstName: true,
      lastName: true,
      companyName: true,
      phone: true,
      taxNumber: true,
      meta: {
        key: true,
        value: true,
      },
      externalReferences: {
        key: true,
        value: true,
      },
      addresses: {
        type: true,
        lastName: true,
        firstName: true,
        email: true,
        middleName: true,
        street: true,
        street2: true,
        city: true,
        country: true,
        state: true,
        postalCode: true,
        phone: true,
        streetNumber: true,
      },
    },
    subscriptionPlan: {
      name: true,
      identifier: true,
      meteredVariables: {
        id: true,
        identifier: true,
        name: true,
        unit: true,
      },
    },
    item: {
      name: true,
      sku: true,
    },
    status: {
      price: true,
      currency: true,
      activeUntil: true,
      renewAt: true,
    },
    initial: {
      period: true,
      unit: true,
      price: true,
      currency: true,
      meteredVariables: {
        id: true,
        tierType: true,
        tiers: {
          threshold: true,
          price: true,
          currency: true,
        },
      },
    },
    recurring: {
      period: true,
      unit: true,
      price: true,
      currency: true,
      meteredVariables: {
        id: true,
        tierType: true,
        tiers: {
          threshold: true,
          price: true,
          currency: true,
        },
      },
    },
  };
};


type SubscriptionContractResult = any
type Deps = {
  client: ClientInterface
}
export const fetchSubscriptionContractByCustomerIdentifier = async (customerIdentifier: string, { client }: Deps): Promise<SubscriptionContractResult[]> => {
  const buildQueryFrom = (cursor?: string) => {
    const args: Record<string, any> = {
      first: 25,
      tenantId: client.config.tenantId,
    };
    if (cursor && cursor.length > 0) {
      args.after = cursor;
    }

    args.customerIdentifier = customerIdentifier;
    return {
      subscriptionContract: {
        getMany: {
          __args: args,
          pageInfo: {
            endCursor: true,
            hasNextPage: true,
          },
          edges: {
            cursor: true,
            node: nodeQuery(),
          },
        },
      },
    };
  };
  async function* fetch() {
    let query = buildQueryFrom();
    let data: any;
    let endCursor: string | undefined;
    do {
      data = await client.pimApi(jsonToGraphQLQuery({ query }));
      for (const edge of data.subscriptionContract.getMany.edges) {
        yield enrichMeteredVariables(edge.node);
        endCursor = edge.cursor;
      }
      query = buildQueryFrom(endCursor);
    } while (data.subscriptionContract.getMany.pageInfo?.hasNextPage);
  }

  const items = [];
  for await (const node of fetch()) {
    items.push(node);
  }
  return items;
};

export const fetchSubscriptionContractById = async (id: string, { client }: Deps): Promise<SubscriptionContractResult> => {
  const query = {
    subscriptionContract: {
      get: {
        __args: {
          id,
        },
        ...nodeQuery(),
      },
    },
  };
  const data = await client.pimApi(jsonToGraphQLQuery({ query }));
  return enrichMeteredVariables(data.subscriptionContract.get);
};
