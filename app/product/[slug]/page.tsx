'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore, useWishlistStore } from '@/store';
import { fallbackImage, cn } from '@/lib/utils';
import type { ProductModel } from '@/types';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [p, setP] = useState<ProductModel | null>(null);
  const [related, setRelated] = useState<ProductModel[]>([]);
  const addItem = useCartStore(s => s.addItem);
  const addToWish = useWishlistStore(s => s.toggle);
  const wishlisted = useWishlistStore(s => s.items.some(w => w.id === p?.id));

  useEffect(() => {
    fetch(`/api/products/${params.slug}`).then(r => r.json()).then(d => { setP(d.product); });
    fetch(`/api/products`).then(r => r.json()).then(d => { setRelated(d.products?.slice(0, 4) || []); });
  }, [params.slug]);

  if (!p) return <div className="pt-36 text-center text-ink-4">Loading…</div>;

  const groupedVariants = p.variants?.reduce<Record<string, any[]>>((acc, v) => {
    (acc[v.type] = acc[v.type] || []).push(v); return acc;
  }, {}) || {};

  return (
    <section className="max-w-7xl mx-auto px-6 pt-36 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-bg2 relative">
            <Image src={p.images?.[0] || fallbackImage(p.name)} alt={p.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {p.images?.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-bg2 relative">
                <Image src={img} alt={`${p.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-36">
          <span className="eyebrow">{p.category}</span>
          <h1 className="heading-lg mt-3">{p.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-2xl font-semibold text-accent">${(p.price / 100).toFixed(2)}</div>
            {p.comparePrice && <div className="text-ink-4 line-through">${(p.comparePrice / 100).toFixed(2)}</div>}
          </div>
          <p className="body-md mt-6">{p.description}</p>

          <div className="mt-10 space-y-6">
            {Object.entries(groupedVariants).map(([type, variants]) => (
              <div key={type}>
                <div className="text-xs tracking-widest uppercase font-semibold text-ink-4 mb-3">{type}</div>
                <div className="flex flex-wrap gap-3">
                  {variants.map(v => (
                    <button key={v.id} className="px-4 py-2 rounded-full border border-border text-sm hover:border-accent transition">{v.name}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={() => addItem({ productId: p.id })} className="btn btn-primary">Add to Cart</button>
            <button onClick={() => addToWish(p as any)} className={cn('btn btn-ghost', wishlisted && 'bg-accent text-white')}>♡ Wishlist</button>
          </div>

          <div className="mt-10 border-t border-border pt-8 space-y-4">
            <details className="group"><summary className="font-semibold flex justify-between cursor-pointer">Shipping & Returns <span className="text-ink-4 group-open:rotate-180 transition-transform">⌄</span></summary>
              <p className="body-md mt-2">Ships in 3–7 business days. 30-day no-hassle returns.</p></details>
            <details className="group"><summary className="font-semibold flex justify-between cursor-pointer">Size Guide <span className="text-ink-4 group-open:rotate-180 transition-transform">⌄</span></summary>
              <p className="body-md mt-2">See product-specific size charts in the dropdown above.</p></details>
            <details className="group"><summary className="font-semibold flex justify-between cursor-pointer">FAQ <span className="text-ink-4 group-open:rotate-180 transition-transform">⌄</span></summary>
              <p className="body-md mt-2">Digital files ship instantly. Physical products print on demand.</p></details>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h3 className="heading-lg mb-10">You might also like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {related.map(r => (
            <Link key={r.id} href={`/product/${r.slug}`} className="group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-bg2 relative">
                <Image src={r.images?.[0] || fallbackImage(r.name)} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="mt-4 font-semibold">{r.name}</div><div className="text-accent">${(r.price / 100).toFixed(2)}</div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}