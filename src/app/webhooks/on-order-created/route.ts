import { updateOrderPaymentStatus } from '@/core/di.server';
import { Order } from '@crystallize/js-api-client';
import { NextResponse } from 'next/server';

// @todo: Signature verifiacation
export async function POST(request: Request) {
    const body = await request.json();
    const order = body.order.get as Order;
    const paymentStatus = Math.random() > 0.5 ? 'success' : 'failed';
    await updateOrderPaymentStatus(order, paymentStatus, 'OrderCreated');
    return NextResponse.json({
        orderId: order.id,
    });
}
