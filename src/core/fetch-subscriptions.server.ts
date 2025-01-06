import { ClientInterface } from "@crystallize/js-api-client"

type Deps = {
  client: ClientInterface
}

export type SubscriptionSlim = {
  name: string
  path: string
  variants: Array<{
    name: string
    sku: string
    subscriptionPlans: Array<{
      identifier: string
      name: string
      periods: Array<{
        name: string
        id: string
        recurring: {
          priceVariants: {
            [identifier: string]: {
              price: number
              currency: string
            }
          }
        }
      }>
    }>
  }>
}
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
          subscriptionPlans {
            identifier
            name
            periods {
              id
              name
              recurring {
                priceVariants
              }
            }
          }
        }
      }
    }
  }
}
`

export const fetchSubscription = async (path: string, { client }: Deps): Promise<SubscriptionSlim | undefined> => {
  const subscriptions = await fetchSubscriptions({ client })
  return subscriptions.find((child: { path: string }) => child.path === path)
}

export const fetchSubscriptions = async ({ client }: Deps): Promise<SubscriptionSlim[]> => {

  // we can't pass feature flags yet to JS-API-Client
  const subscriptions = await client.discoveryApi(QUERY)
  return subscriptions.browse.product.hits
}
