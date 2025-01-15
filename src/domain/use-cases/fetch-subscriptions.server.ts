import { ClientInterface } from '@crystallize/js-api-client';
import { SubscriptionSlim } from '../contracts/subcription-slim';

type Deps = {
    crystallizeClient: ClientInterface;
};

export const createSubscriptionFetcher = ({ crystallizeClient }: Deps) => {
    const fetchSubscription = async (path: string): Promise<SubscriptionSlim | undefined> => {
        const subscriptions = await fetchSubscriptions();
        return subscriptions.find((child: { path: string }) => child.path === path);
    };

    const fetchSubscriptions = async (): Promise<SubscriptionSlim[]> => {
        const subscriptions = await crystallizeClient.discoveryApi(QUERY);
        return subscriptions.browse.product.hits;
    };

    return {
        fetchSubscription,
        fetchSubscriptions,
    };
};

const QUERY = `#graphql
{
  browse {
    product(sorting: {position:asc}) {
      hits {
        path
        name
        component_name
        description(format:json)
        variants {
          name
          sku
          usp {
            uniqueBenefits {
              header
              benefits {
                valueProposition
              }
            }
          }
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
