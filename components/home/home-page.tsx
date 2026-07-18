'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fallbackImage } from '@/lib/utils';
import type { ProductModel } from '@/types';

const HIGHLIGHTS: { title: string; body: string }[] = [
  { title: 'Printful connected', body: 'Every order ships automatically.' },
  { title: 'Worldwide fulfillment', body: '14 global print facilities.' },
  { title: 'Zero inventory', body: 'We print only what sells.' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<ProductModel[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductModel[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([f, a]) => {
      setFeatured(f.products || []);
      setNewArrivals((a.products || []).slice(0, 8));
    });
  }, []);

  return (
    <section className="overflow-hidden">
      {/* Hero */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <motion.div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs tracking-widest uppercase mb-6">Printful Partner</span>
            <h1 className="font-display text-white text-5xl md:text-7xl font-semibold leading-[1.08] mb-6">Wear the future.<br/>Delivered today.</h1>
            <p className="text-white/75 text-lg md:text-xl max-w-md mb-10 leading-relaxed">Premium print-on-demand essentials — elevated apparel, accessories and home goods designed for modern creators.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn btn-primary">Shop the collection</Link>
              <Link href="#featured" className="btn btn-ghost text-white border-white/30 hover:bg-white hover:text-black">Explore featured</Link>
            </div>
          </div>
          <div className="flex gap-6 mt-16 text-white">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="flex-1 border-t border-white/20 pt-4">
                <div className="font-semibold">{h.title}</div>
                <div className="text-white/60 text-sm">{h.body}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Featured */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="eyebrow">Curated</span>
            <h2 className="heading-lg">Featured products</h2>
          </div>
          <Link href="/shop" className="btn btn-ghost text-sm">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.slice(0, 8).map(p => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative">
                <Image src={p.images?.[0] || fallbackImage(p.name)} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-4">
                <div className="text-xs text-ink-4 uppercase tracking-widest">{p.category}</div>
                <div className="font-semibold mt-1">{p.name}</div>
                <div className="mt-1 text-accent font-semibold">${(p.price / 100).toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand story / lifestyle */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="eyebrow text-white/60">About the brand</span>
            <h2 className="heading-lg text-white">Designed for the makers.<br/>Printed for the world.</h2>
            <p className="body-md text-white/70 mt-6">New Nation bridges premium design with frictionless fulfillment. Every piece ships from Printful’s global network — so you get quality, speed, and sustainability in one order.</p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="border border-white/10 rounded-2xl p-6"><div className="text-3xl font-display font-semibold">14+</div><div className="text-white/60 text-sm mt-1">Print facilities</div></div>
              <div className="border border-white/10 rounded-2xl p-6"><div className="text-3xl font-display font-semibold">200+</div><div className="text-white/60 text-sm mt-1">Countries shipped</div></div>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5">
            <img src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=900&auto=format&fit=crop" alt="Lifestyle" className="w-full h-full object-cover opacity-80" />
          </div>
        </div>
      </section>
    </section>
  );
}