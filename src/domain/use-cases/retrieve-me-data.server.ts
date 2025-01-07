import { ClientInterface, Customer } from '@crystallize/js-api-client';

type Deps = {
    crystallizeClient: ClientInterface;
};

export const createMeDataRetriever =
    ({ crystallizeClient }: Deps) =>
    async (identifier: string): Promise<Customer> => {
        const me = await crystallizeClient.pimApi(`#graphql
    {
        customer {
            get(tenantId:"${crystallizeClient.config.tenantId}", identifier:"${identifier}") {
                firstName
                lastName
                middleName
                identifier
                birthDate
                phone
                companyName
                taxNumber
                addresses {
                    type
                    firstName
                    lastName
                    middleName
                    street
                    street2
                    streetNumber
                    postalCode
                    city
                    state
                    country
                    phone
                    email
                    meta {
                        key
                        value
                    }
                }
                meta {
                    key
                    value
                }
            }
        }
    }`);
        return me.customer.get;
    };
