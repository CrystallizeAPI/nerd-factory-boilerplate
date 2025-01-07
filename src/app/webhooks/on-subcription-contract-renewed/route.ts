import { computeContractBill, createNewOrderFromContractAndUsage } from '@/core/di.server';
import { NextResponse } from 'next/server';

// @todo: Signature verifiacation
export async function POST(request: Request) {
    const body = await request.json();
    const contract = body.subscriptionContract.get;
    const bill = await computeContractBill({ contract });
    const orderConfirmation = await createNewOrderFromContractAndUsage(contract, bill);
    return NextResponse.json({
        contract,
        orderConfirmation,
    });
}
