'use server'

import { container } from "@/core/container.server";
import { jsonToGraphQLQuery } from "json-to-graphql-query";

export async function trackUsageOnSubscriptionContractAction(prevState: unknown, formData: FormData) {
    const id = formData.get('id') as string;
    const meteredVariables: Record<string, number> = {};

    formData.forEach((value, key) => {
        if (key.startsWith('meteredVariables[')) {

            const match = key.match(/\[(.*?)\]/);
            if (match) {
                const key = match[1];
                meteredVariables[key] = Number(value);
            }
        }
    });

    for (const mvId in meteredVariables) {
        const mutation = {
            subscriptionContract: {
                trackUsage: {
                    __args: {
                        id,
                        input: {
                            meteredVariableId: mvId,
                            quantity: meteredVariables[mvId]
                        }
                    },
                    id: true
                }
            }
        };
        await container.crystallizeClient.pimApi(jsonToGraphQLQuery({ mutation }));
    }
}
