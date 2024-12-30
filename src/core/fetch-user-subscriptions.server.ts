/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientInterface } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

type MeteredVariable = {
  id: string;
  tierType: string;
  tiers: {
    currency: string;
    threshold: number;
    price: number;
  }[];
};

type PlanMeteredVariable = {
  id: string;
  identifier: string;
  name: string;
  unit: string;
}

type EnrichedMeteredVariable = MeteredVariable & PlanMeteredVariable;

type Phase = {
  period: number;
  unit: string;
  price: number;
  currency: string;
  meteredVariables?: MeteredVariable[];
}

export type EnrichedPhase = Omit<Phase, 'meteredVariables'> & {
  meteredVariables?: EnrichedMeteredVariable[];
}

type SubscriptionContract = {
  id: string;
  tenantId: string;
  subscriptionPlan: {
    name: string;
    identifier: string;
    meteredVariables: PlanMeteredVariable[];
  };
  item: {
    name: string;
    sku: string;
  };
  payment: {
    properties: {
      property: string;
      value: string;
    }[];
  };
  initial?: Phase;
  recurring: Phase;
  status: {
    renewAt: string;
    activeUntil: string;
    price: number;
    currency: string;
  };
  meta: {
    key: string;
    value: string;
  }[];
  customerIdentifier: string;
  customer: {
    identifier: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    phone: string;
    taxNumber: string;
    meta: {
      key: string;
      value: string;
    }[];
    externalReferences: {
      key: string;
      value: string;
    }[];
    addresses: {
      type: string;
      lastName: string;
      firstName: string;
      email: string;
      middleName: string;
      street: string;
      street2: string;
      city: string;
      country: string;
      state: string;
      postalCode: string;
      phone: string;
      streetNumber: string;
    }[];
  };
}


export type EnrichedSubscriptionContract = Omit<SubscriptionContract, 'initial' | 'recuring'> & {
  initial?: EnrichedPhase;
  recurring: EnrichedPhase;
};

export const enrichMeteredVariables = (contract: SubscriptionContract): EnrichedSubscriptionContract => {
  const { initial, recurring } = contract;

  const definition: Record<string, PlanMeteredVariable> =
    contract.subscriptionPlan?.meteredVariables?.reduce((accumulator: any, variable) => {
      accumulator[variable.id] = variable;
      return accumulator;
    }, {}) ?? [];

  const enrichedRecurring: EnrichedSubscriptionContract['recurring'] = {
    ...recurring,
    meteredVariables:
      recurring.meteredVariables?.map((variable) => {
        return {
          ...variable,
          ...definition[variable.id],
        };
      }) ?? []
  };

  if (!initial) {
    return {
      ...contract as Omit<SubscriptionContract, 'initial' | 'recurring'>,
      recurring: enrichedRecurring,
    };
  }

  return {
    ...contract,
    initial: {
      ...initial,
      meteredVariables:
        initial.meteredVariables?.map((variable) => {
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
    tenantId: true,
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
    payment: {
      __on: {
        __typeName: "CustomPayment",
        properties: {
          property: true,
          value: true
        }
      }
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
          currency: true,
          threshold: true,
          price: true,
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
          currency: true,
          threshold: true,
          price: true,
        },
      },
    },
    status: {
      renewAt: true,
      activeUntil: true,
      price: true,
      currency: true,
    },
    customerIdentifier: true,
    customer: {
      identifier: true,
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
  };
};



type Deps = {
  client: ClientInterface
}
export const fetchSubscriptionContractByCustomerIdentifier = async (customerIdentifier: string, { client }: Deps): Promise<EnrichedSubscriptionContract[]> => {
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

export const fetchSubscriptionContractById = async (id: string, { client }: Deps): Promise<EnrichedSubscriptionContract> => {
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
