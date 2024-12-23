import { ClientInterface, createCustomerManager } from "@crystallize/js-api-client";

type CustomerSlim = {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
};

type Deps = {
    client: ClientInterface;
}

export const createCustomerIfNeeded = async ({
    email,
    firstName,
    lastName,
    companyName
}: CustomerSlim, { client }: Deps) => {
    try {
        const manager = createCustomerManager(client);
        await manager.create({
            firstName,
            lastName,
            identifier: email,
            companyName,
            email,
        });
    } catch (exception) {
        console.error(exception)
        // we save a get + test by catching the exception and do nothing here
        const message = (exception as Error).message;
        if (!message.includes('Customer with')) {
            throw exception;
        }
    }
}
