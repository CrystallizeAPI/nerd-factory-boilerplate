import { computeContractBill, createNewOrderFromContractAndUsage } from '@/core/di.server';
import { NextResponse } from 'next/server';

// @todo: Signature verifiacation
export async function POST(request: Request) {
    const body = await request.json();
    const contract = body.subscriptionContract.get;
    const bill = await computeContractBill({
        contract,
        period: {
            from: new Date(parseInt(contract.id.substring(0, 8), 16) * 1000),
            to: new Date(),
        },
    });
    const orderConfirmation = await createNewOrderFromContractAndUsage(contract, bill);
    return NextResponse.json({
        contract,
        orderConfirmation,
    });
}
