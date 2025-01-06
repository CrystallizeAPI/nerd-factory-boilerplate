import { ClientInterface, RichTextContent } from '@crystallize/js-api-client';

type Deps = {
    client: ClientInterface;
};

export const fetchSubscription = async (path: string, { client }: Deps): Promise<SubscriptionSlim | undefined> => {
    const subscriptions = await fetchSubscriptions({ client });
    return subscriptions.find((child: { path: string }) => child.path === path);
};

export const fetchSubscriptions = async ({ client }: Deps): Promise<SubscriptionSlim[]> => {
    const subscriptions = await client.discoveryApi(QUERY);
    return subscriptions.browse.product.hits;
};

// QUERY and its TYPES

type Image = {
    url: string;
    key: string;
    width: number;
    height: number;
    variants: Array<{
        url: string;
        key: string;
        width: number;
        height: number;
    }>;
};
type Phase = {
    period: number;
    unit: string;
    meteredVariables: Array<{
        identifier: string;
        name: string;
        unit: string;
        tierType: string;
    }>;
    priceVariants: {
        [identifier: string]: {
            price: number;
            currency: string;
        };
    };
};
export type SubscriptionSlim = {
    name: string;
    path: string;
    variants: Array<{
        name: string;
        sku: string;
        description: RichTextContent['json'];
        firstImage: Image;
        subscriptionPlans: Array<{
            identifier: string;
            name: string;
            periods: Array<{
                name: string;
                id: string;
                initial?: Phase;
                recurring: Phase;
            }>;
        }>;
    }>;
};
const QUERY = `#graphql
{
  browse {
    product {
      hits {
        path
        name
        variants {
          name
          sku
          description(format: json)
          firstImage {
            ...image
          }
          subscriptionPlans {
            identifier
            name
            periods {
              id
              name
              initial {
                ...phase
              }
              recurring {
                ...phase
              }
            }
          }
        }
      }
    }
  }
}

fragment image on Image {
  url
  key
  width
  height
  variants {
    url
    key
    width
    height
  }
}

fragment phase on SubscriptionPlanPhase {
  period
  unit
  defaultPrice
  priceVariants
  meteredVariables {
    identifier
    name
    unit
    tierType
  }
}
`;
