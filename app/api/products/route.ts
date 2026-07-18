import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || undefined;
  const search = url.searchParams.get('search') || undefined;
  const featured = url.searchParams.get('featured');

  const where: any = { status: 'active' };
  if (category) where.category = category;
  if (featured) where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  try {
    const products = await prisma.product.findMany({
      where,
      include: { variants: { where: { available: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { featured: 'desc' },
      take: 200,
    });
    return NextResponse.json({ products });
  } catch (e) {
    console.error('Products API failed', e);
    return NextResponse.json({ products: [], error: 'db_unavailable' });
  }
}
