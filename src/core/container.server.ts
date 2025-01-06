import { createClient } from '@crystallize/js-api-client';

const crystallizeClient = createClient({
    tenantIdentifier: `${process.env.CRYSTALLIZE_TENANT_IDENTIFIER}`,
    tenantId: process.env.CRYSTALLIZE_TENANT_ID,
    accessTokenId: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    accessTokenSecret: process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
}, {
    extraHeaders: {
        'X-Discovery-Feature-Flags': 'structuredSubscriptionPlans'
    }
});

export const container = {
    crystallizeClient,
    pipelines: {
        paymentFlow: {
            id: '6772fe8bbb3f753d1601d885',
            stages: {
                toCapture: '6772fe8bbb3f753d1601d881',
                processing: '6772fe8bbb3f753d1601d882',
                success: '6772fe8bbb3f753d1601d884',
                failed: '6772fe8bbb3f753d1601d883'
            }
        }
    }
}
