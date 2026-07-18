'use client';
import { useEffect, useState } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { useCartStore, useWishlistStore } from '@/store';
import { fallbackImage } from '@/lib/utils';
import type { ProductModel } from '@/types';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');
  const addItem = useCartStore(s => s.addItem);
  const wishlist = useWishlistStore(s => s.items);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('cat')) setCategory(url.searchParams.get('cat') || 'all');
  }, []);

  useEffect(() => {
    fetch(`/api/products${category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''}${query ? `&search=${encodeURIComponent(query)}` : ''}`)
      .then(r => r.json()).then(d => setProducts(d.products || []));
  }, [category, query]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <section className="max-w-7xl mx-auto px-6 pt-36 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="hidden lg:block space-y-8">
          <section>
            <h3 className="text-xs tracking-widest uppercase font-semibold text-ink-4 mb-4">Category</h3>
            <div className="flex flex-col gap-3">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={cn('text-left text-sm transition-colors', category === c ? 'text-accent font-semibold' : 'text-ink-3 hover:text-ink')}>{c === 'all' ? 'All Products' : c}</button>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xs tracking-widest uppercase font-semibold text-ink-4 mb-4">Availability</h3>
            <label className="flex items-center gap-3 text-sm text-ink-3"><input type="checkbox" className="accent-accent" defaultChecked /> In stock</label>
          </section>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="heading-lg">Shop</h1>
              <p className="text-ink-3 mt-2 text-sm">{products.length} products</p>
            </div>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" className="input w-64" />
          </div>

          <ProductGrid products={products} />
          {!products.length && <div className="text-center text-ink-4 py-20">No products found.</div>}
        </div>
      </div>
    </section>
  );
}