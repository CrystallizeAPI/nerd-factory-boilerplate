import { ClientInterface, createCustomerManager } from '@crystallize/js-api-client';
import { CustomerSlim } from '../contracts/customer-slim';

type Deps = {
    crystallizeClient: ClientInterface;
};

export const createCustomerCreator =
    ({ crystallizeClient }: Deps) =>
    async ({ email, firstName, lastName, companyName }: CustomerSlim) => {
        try {
            const manager = createCustomerManager(crystallizeClient);
            await manager.create({
                firstName,
                lastName,
                identifier: email,
                companyName,
                email,
            });
        } catch (exception) {
            console.error(exception);
            // we save a get + test by catching the exception and do nothing here
            const message = (exception as Error).message;
            if (!message.includes('Customer with')) {
                throw exception;
            }
        }
    };
