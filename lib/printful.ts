import { prisma } from '@/lib/prisma';

const PRINTFUL_BASE = 'https://api.printful.com';

export async function printfulFetch(path: string, init?: RequestInit) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) throw new Error('Missing PRINTFUL_API_KEY');
  const res = await fetch(`${PRINTFUL_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`Printful error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function submitPrintfulOrder(order: { items: any[]; shipping: any; recipient: any; }) {
  const payload = { recipient: order.recipient, items: order.items };
  return printfulFetch('/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export async function syncPrintfulProducts() {
  const data = await printfulFetch('/products?limit=100');
  const list = Array.isArray(data?.result) ? data.result : [];

  let synced = 0;
  let created = 0;
  let updated = 0;

  for (const pf of list) {
    const slug = String(pf.slug || pf.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80);
    const name = pf.name || `Product ${pf.id}`;
    const thumb = pf.thumbnail_url || pf.images?.[0] || `https://placehold.co/800x1000/eeeeee/555555?text=${encodeURIComponent(name)}`;
    const category = (pf.type || 'general').toString();
    const brand = (pf.brand || 'New Nation').toString();

    const existing = await prisma.product.findUnique({ where: { printfulId: String(pf.id) } }).catch(() => null);

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { name, slug, category, brand, description: existing.description || `${brand} ${category}.`, images: [thumb], tags: [category.toLowerCase(), 'printful'], status: 'active' },
      });
      updated += 1;
    } else {
      await prisma.product.create({
        data: { printfulId: String(pf.id), slug: `${slug}-${pf.id}`, name, category, brand, price: 0, description: `${brand} ${category}.`, images: [thumb], tags: [category.toLowerCase(), 'printful'], status: 'active', featured: false, rating: 0, reviewCount: 0 },
      });
      created += 1;
    }
    synced += 1;
  }

  return { synced, created, updated };
}