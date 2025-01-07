import { handlerOrderPipelineChange } from '@/core/di.server';
import { Order } from '@crystallize/js-api-client';
import { NextResponse } from 'next/server';

// @todo: Signature verifiacation
export async function POST(request: Request) {
    const body = await request.json();
    const order = body.order.get as Order;
    const pipelineEvent = body.pipeline.get;
    const results = await handlerOrderPipelineChange(order, pipelineEvent, body.order.get.pipelines);
    if (results && 'orderId' in results) {
        return NextResponse.json(results);
    }
    return new Response(`Unauthorized.`, { status: 401 });
}
