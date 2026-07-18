'use client';
import { Fragment, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store';
import { useUIStore } from '@/store';
import { formatCurrency } from '@/lib/utils';

export default function CartDrawer() {
  const items = useCartStore(s => s.items);
  const removeItem = useCartStore(s => s.removeItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const subtotal = useCartStore(s => s.subtotal)();
  const cartOpen = useUIStore(s => s.cartOpen);
  const toggleCart = useUIStore(s => s.toggleCart);

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div className="fixed inset-0 z-[200]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleCart} />
          <motion.div className="absolute right-0 top-0 h-full w-full max-w-md bg-bg border-l border-border shadow-2xl flex flex-col" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 220 }}>
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="font-display text-2xl">Your Cart</h2>
              <button onClick={toggleCart} className="text-2xl leading-none text-ink-4 hover:text-ink">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 && <div className="text-ink-4 text-center py-20">Your cart is empty.</div>}
              {items.map(i => (
                <div key={i.id} className="flex gap-4 border-b border-border last:border-0 py-4">
                  <div className="w-20 h-24 rounded-xl bg-bg2 overflow-hidden flex-shrink-0 relative">
                    {i.product?.images?.[0] && <Image src={i.product.images[0]} alt="" fill className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{i.product?.name}</div>
                    <div className="text-ink-4 text-xs mt-1">{i.variant?.name}</div>
                    <div className="text-accent font-semibold text-sm mt-2">{formatCurrency((i.product?.price || 0) * i.quantity)}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(i.id, i.quantity - 1)} className="w-7 h-7 rounded-full border border-border">−</button>
                      <span className="text-sm">{i.quantity}</span>
                      <button onClick={() => updateQuantity(i.id, i.quantity + 1)} className="w-7 h-7 rounded-full border border-border">+</button>
                      <button onClick={() => removeItem(i.id)} className="ml-auto text-xs text-red-500">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <p className="text-xs text-ink-4">Shipping, taxes, and discounts calculated at checkout.</p>
                <a href="/checkout" className="btn btn-primary w-full justify-center" onClick={toggleCart}>Checkout</a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}