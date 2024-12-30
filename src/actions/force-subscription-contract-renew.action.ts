'use server'

import { container } from "@/core/container.server";
import { revalidatePath } from "next/cache";

export async function forceSubscriptionContractRenewAction(prevState: unknown, formData: FormData) {
    const id = formData.get('id') as string;
    await container.crystallizeClient.pimApi(`mutation { subscriptionContract { renew(id:"${id}") { id } } }`);
    revalidatePath('/my/subscriptions', 'page');

}
