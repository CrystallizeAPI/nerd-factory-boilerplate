import { createClient } from '@crystallize/js-api-client';

const crystallizeClient = createClient({
    tenantIdentifier: `${process.env.CRYSTALLIZE_TENANT_IDENTIFIER}`,
    tenantId: process.env.CRYSTALLIZE_TENANT_ID,
    accessTokenId: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    accessTokenSecret: process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
});

export const container = {
    crystallizeClient
}
