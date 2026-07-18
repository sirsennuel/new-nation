import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHmac } from 'node:crypto';
import { mapPrintfulWebhook } from '@/lib/printfulWebhooks';

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const secret = process.env.PRINTFUL_WEBHOOK_SECRET || '';
    if (secret) {
      const sig = request.headers.get('X-Printful-Signature') || '';
      const expected = createHmac('sha256', secret).update(raw).digest('hex');
      if (sig !== expected) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(raw);
    const payload = mapPrintfulWebhook(event);

    await prisma.webhookLog.create({ data: { source: 'printful', eventType: event.type, payload: event } });

    if (payload.type === 'shipment' && (event.data as any)?.id) {
      await prisma.order.update({
        where: { printfulOrderId: String((event.data as any).id) },
        data: { fulfillmentStatus: 'shipped', trackingNumber: payload.trackingNumber, trackingUrl: payload.trackingUrl },
      });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Printful webhook error', e);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}