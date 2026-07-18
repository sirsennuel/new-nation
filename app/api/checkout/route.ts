import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items, shippingAddress, shippingMethod = 'standard', coupon } = body;

    const subtotal = items.reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0);
    const discount = coupon && coupon.type === 'percent'
      ? Math.floor(subtotal * coupon.value / 100)
      : (coupon?.value || 0);
    const shippingCents = body.shippingCents || 0;
    const taxCents = body.taxCents || 0;
    const total = Math.max(0, subtotal - discount + shippingCents + taxCents);

    const order = await prisma.order.create({
      data: {
        email,
        status: 'pending',
        fulfillmentStatus: 'unfulfilled',
        orderNumber: `NN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        subtotalCents: subtotal,
        discountCents: discount,
        taxCents,
        shippingCents,
        totalCents: total,
        currency: 'USD',
        shippingAddress,
        billingAddress: shippingAddress,
        couponCode: coupon?.code,
      },
    });

    await prisma.orderItem.createMany({
      data: items.map((i: any) => ({
        orderId: order.id,
        productId: i.productId,
        variantId: i.variantId || null,
        name: i.name,
        variantLabel: i.variantLabel || null,
        quantity: i.quantity,
        unitPriceCents: i.unitPrice,
        totalCents: i.unitPrice * i.quantity,
        printfulStatus: 'pending',
      })),
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (e) {
    console.error('Checkout failed', e);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}