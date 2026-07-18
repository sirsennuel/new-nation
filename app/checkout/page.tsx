'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { fallbackImage } from '@/lib/utils';
import type { ProductModel } from '@/types';

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCartStore();
  const [shipping, setShipping] = useState({ firstName: '', lastName: '', email: '', address1: '', city: '', country: 'US', postalCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const total = subtotal();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: shipping.email, items, shippingAddress: shipping, shippingMethod: 'standard', shippingCents: 0 }) });
      const data = await res.json();
      if (data.clientSecret) {
        const { loadStripe } = await import('@stripe/stripe-js');
        const s = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (!s) { setStatus('error'); return; }
        const { error } = await s.confirmPayment({ clientSecret: data.clientSecret, confirmParams: { return_url: window.location.href } });
        if (error) { setStatus('error'); } else { setStatus('success'); await clear(); }
      } else {
        setStatus('error');
      }
    } catch { setStatus('error'); }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pt-36 pb-24">
      <h1 className="heading-lg mb-10">Checkout</h1>
      {status === 'success' ? (
        <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="text-6xl mb-4">✓</div><h2 className="heading-lg">Order Confirmed</h2><p className="body-md mt-2">You’ll receive an email confirmation shortly.</p><Link href="/shop" className="btn btn-primary mt-8 inline-flex">Continue Shopping</Link></motion.div>
      ) : (
        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h3 className="font-semibold mb-4">Contact</h3>
              <input className="input" type="email" placeholder="Email" required onChange={e => setShipping({ ...shipping, email: e.target.value })} />
            </section>
            <section>
              <h3 className="font-semibold mb-4">Shipping</h3>
              <div className="grid grid-cols-2 gap-4">
                <input className="input" placeholder="First name" required value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} />
                <input className="input" placeholder="Last name" required value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} />
              </div>
              <div className="mt-4"><input className="input" placeholder="Address" required value={shipping.address1} onChange={e => setShipping({ ...shipping, address1: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <input className="input" placeholder="City" required value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} />
                <input className="input" placeholder="ZIP" required value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} />
                <input className="input" placeholder="Country" required value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })} />
              </div>
            </section>
            <section>
              <h3 className="font-semibold mb-4">Payment</h3>
              <div className="grid grid-cols-3 gap-3">
                {['stripe','paypal','apple_pay'].map(m => (<button key={m} type="button" onClick={() => setPaymentMethod(m)} className={`p-4 border rounded-xl text-center capitalize ${paymentMethod === m ? 'border-accent bg-accent/10' : 'border-border'}`}>{m.replace('_',' ')}</button>))}
              </div>
            </section>
            <button type="submit" disabled={status === 'submitting'} className="btn btn-primary w-full justify-center">{status === 'submitting' ? 'Processing…' : `Pay ${formatCurrency(total)}`}</button>
          </div>
          <div className="border border-border rounded-2xl p-6 h-fit sticky top-36">
            <h3 className="font-display text-xl mb-6">Order Summary</h3>
            <div className="space-y-4">
              {items.map(i => <div key={i.id} className="flex justify-between text-sm"><span>{i.quantity}x {i.product?.name}</span><span>{formatCurrency((i.product?.price || 0) * i.quantity)}</span></div>)}
            </div>
            <div className="border-t border-border mt-6 pt-4 flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
        </form>
      )}
    </section>
  );
}