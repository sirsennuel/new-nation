import { prisma } from '@/lib/prisma';
import { submitPrintfulOrder } from '@/lib/printful';

export async function fulfillWithPrintful(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || !order.printfulOrderId) return null;

  try {
    const webhook = await fetch(`https://api.printful.com/orders/${order.printfulOrderId}`, {
      headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}` },
    });
    const data = await webhook.json();

    await prisma.order.update({
      where: { id: order.id },
      data: {
        fulfillmentStatus: 'fulfilled',
        trackingNumber: data.result?.shipments?.[0]?.tracking_number || null,
        trackingUrl: data.result?.shipments?.[0]?.tracking_url || null,
      },
    });
    return data;
  } catch (e) {
    console.error('Printful sync failed', e);
    await prisma.order.update({ where: { id: order.id }, data: { fulfillmentStatus: 'failed' } });
    return null;
  }
}

export async function createPrintfulOrderFromInternal(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return;

  const items = order.items.map(i => ({
    product_id: parseInt(i.printfulItemId || '0'),
    variant_id: parseInt(i.printfulItemId || '0'),
    quantity: i.quantity,
  }));

  const address = (order.shippingAddress as any) || {};
  const payload = {
    recipient: {
      name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
      email: order.email,
      phone: address.phone,
      address: address.address1,
      address2: address.address2,
      city: address.city,
      state: address.state,
      zip: address.postalCode,
      country: address.country,
    },
    items,
    shipping: 'STANDARD',
    packing_slip: { 'included': true, 'inserts': [] },
  };

  const result = await submitPrintfulOrder(payload);
  const pfOrderId = String((result as any).result?.id || '');
  if (pfOrderId) {
    await prisma.order.update({ where: { id: order.id }, data: { printfulOrderId: pfOrderId, fulfillmentStatus: 'in_progress' } });
  }
  return result;
}