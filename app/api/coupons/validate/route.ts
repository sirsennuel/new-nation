import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const coupon = await prisma.coupon.findUnique({ where: { code: body.code.toUpperCase() } });
    if (!coupon || !coupon.active) return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 });
    if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) return NextResponse.json({ error: 'Coupon not active' }, { status: 400 });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: 'Coupon fully redeemed' }, { status: 400 });

    return NextResponse.json({ coupon: { code: coupon.code, type: coupon.type, value: coupon.value } });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}