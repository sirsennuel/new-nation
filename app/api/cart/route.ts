import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function cartWhere(sessionId?: string, userId?: string) {
  if (sessionId) return { sessionId };
  if (userId) return { userId };
  return undefined;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId') || undefined;
  const userId = url.searchParams.get('userId') || undefined;
  const where = cartWhere(sessionId, userId);

  if (!where) return NextResponse.json({ items: [], total: 0, subtotal: 0 });

  const items = await prisma.cartItem.findMany({ where, include: { product: { include: { variants: true } } } });
  const total = items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
  const subtotal = items.reduce((s: number, i: { product: { price: number }; quantity: number }) => s + i.product.price * i.quantity, 0);

  return NextResponse.json({ items, total, subtotal });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, variantId, quantity = 1, sessionId, userId } = body;

    const where = cartWhere(sessionId, userId);
    if (!where) return NextResponse.json({ error: 'Missing session or user' }, { status: 400 });

    const existing = await prisma.cartItem.findFirst({ where: { ...where, productId, variantId: variantId || null } });

    if (existing) {
      const updated = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity }, include: { product: true } });
      return NextResponse.json({ item: updated });
    }

    const created = await prisma.cartItem.create({ data: { productId, variantId: variantId || null, quantity, sessionId: sessionId || null, userId: userId || null }, include: { product: true } });
    return NextResponse.json({ item: created });
  } catch (e) {
    console.error('Cart POST failed', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, clear, sessionId, userId } = body;
    const where = cartWhere(sessionId, userId);

    if (clear && where) {
      await prisma.cartItem.deleteMany({ where });
      return NextResponse.json({ ok: true });
    }

    if (id) await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Cart DELETE failed', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}