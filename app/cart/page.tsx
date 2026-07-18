'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <section className="max-w-7xl mx-auto px-6 pt-36 pb-24">
      <h1 className="heading-lg mb-10">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {!items.length && <div className="text-ink-4 py-20">Your cart is empty.</div>}
          {items.map(i => (
            <div key={i.id} className="flex gap-6 border-b border-border py-6 last:border-0">
              <div className="w-24 h-28 rounded-xl bg-bg2 overflow-hidden flex-shrink-0 relative">
                {i.product?.images?.[0] && <Image src={i.product.images[0]} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{i.product?.name}</div>
                <div className="text-xs text-ink-4 mt-1 uppercase tracking-wider">{i.variant?.type}: {i.variant?.name}</div>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQuantity(i.id, i.quantity - 1)} className="w-8 h-8 rounded-full border border-border">−</button>
                  <span>{i.quantity}</span>
                  <button onClick={() => updateQuantity(i.id, i.quantity + 1)} className="w-8 h-8 rounded-full border border-border">+</button>
                  <button onClick={() => removeItem(i.id)} className="ml-auto text-sm text-red-500">Remove</button>
                </div>
              </div>
              <div className="text-right"><div className="text-accent font-semibold">{formatCurrency((i.product?.price || 0) * i.quantity)}</div></div>
            </div>
          ))}
        </div>
        <div className="lg:sticky lg:top-36 space-y-6">
          <div className="border border-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between text-sm"><span className="text-ink-3">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>−{formatCurrency(discount)}</span></div>}
            <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
            <a href="/checkout" className="btn btn-primary w-full justify-center">Checkout</a>
          </div>
          <div className="flex gap-2">
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon" className="input flex-1" />
            <button onClick={async () => { const r = await fetch('/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code: coupon }), headers: { 'Content-Type': 'application/json' } }); const d = await r.json(); if (d.coupon?.type === 'percent') setDiscount(Math.floor(subtotal * d.coupon.value / 100)); else setDiscount(d.coupon?.value || 0); }} className="btn btn-ghost">Apply</button>
          </div>
        </div>
      </div>
    </section>
  );
}