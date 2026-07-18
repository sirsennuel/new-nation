import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, VARIANTS } from '@/data/products';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const product = PRODUCTS.find(p => p.slug === params.slug && p.status === 'active');
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product: { ...product, variants: VARIANTS[product.id] || [] } });
}
