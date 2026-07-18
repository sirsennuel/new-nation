import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, VARIANTS } from '@/data/products';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || undefined;
  const search = url.searchParams.get('search') || undefined;
  const featured = url.searchParams.get('featured');

  let products = PRODUCTS.filter(p => p.status === 'active');
  if (category) products = products.filter(p => p.category === category);
  if (featured) products = products.filter(p => p.featured);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
  }

  const withVariants = products.map(p => ({
    ...p,
    variants: VARIANTS[p.id] || [],
  }));

  return NextResponse.json({ products: withVariants });
}
