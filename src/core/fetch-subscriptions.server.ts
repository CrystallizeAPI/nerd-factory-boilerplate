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
    priceVariants: Array<{
      identifier: string
      price: number
      currency: string
    }>
    subscriptionPlans: Array<{
      identifier: string
      name: string
      periods: Array<{
        name: string
        id: string
        recurring: {
          priceVariants: Array<{
            identifier: string
            name: string
            currency: string
          }>
        }
      }>
    }>
  }>
}
const QUERY = `#graphql
{
  catalogue(path: "/") {
    children {
      path
      name
      ... on Product {
        variants {
          name
          sku
        subscriptionPlans {
            identifier
            name
            periods {
              name
              id
              recurring {
                priceVariants {
                  identifier
                  name
                  currency
                }
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
  const subscriptions = await client.catalogueApi(QUERY)
  return subscriptions.catalogue.children
}
