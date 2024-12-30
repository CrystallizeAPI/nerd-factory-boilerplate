import { computeContractBill } from "@/core/compute-subscription-contract-bill.server";
import { container } from "@/core/container.server";
import { createNewOrderFromContractAndUsage } from "@/core/create-new-order-from-contract-and-usage";
import { enrichMeteredVariables } from "@/core/fetch-user-subscriptions.server";
import { NextResponse } from "next/server";

// @todo: Signature verifiacation
export async function POST(request: Request) {
    const body = await request.json();
    const contract = enrichMeteredVariables(body.subscriptionContract.get);
    const bill = await computeContractBill({ contract }, { client: container.crystallizeClient });
    const orderConfirmation = await createNewOrderFromContractAndUsage(contract, bill, { client: container.crystallizeClient })
    return NextResponse.json({
        contract,
        orderConfirmation,
    });
}
