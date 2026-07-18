import { Prisma } from '@prisma/client';

export const PRINTFUL_WEBHOOK_TYPES = ['order_created', 'order_updated', 'shipment_created', 'shipment_fulfilled', 'inventory_updated'];

export function mapPrintfulWebhook(event: any) {
  const type = event.type;

  if (type.startsWith('shipment_')) {
    return {
      type: 'shipment',
      orderId: (event.data as any)?.external_id || (event.data as any)?.id,
      trackingNumber: (event.data as any)?.tracking_number || null,
      trackingUrl: (event.data as any)?.tracking_url || null,
      carrier: (event.data as any)?.carrier || null,
      status: 'shipped',
    };
  }

  if (type.startsWith('order_')) {
    return {
      type: 'order',
      printfulOrderId: String((event.data as any)?.id || ''),
      orderId: (event.data as any)?.external_id || null,
      status: (event.data as any)?.status || 'fulfilled',
      items: (event.data as any)?.items || [],
    };
  }

  return { type: 'unknown', data: event };
}