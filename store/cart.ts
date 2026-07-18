'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItemModel, CartMode } from '@/types';
import { fallbackImage } from '@/lib/utils';

export interface CartStore {
  mode: CartMode;
  userId?: string;
  sessionId?: string;
  items: CartItemModel[];
  hydrate: () => Promise<void>;
  setMode: (mode: CartMode, id?: string) => void;
  addItem: (item: { productId: string; variantId?: string; quantity?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  subtotal: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      mode: 'guest',
      sessionId: crypto.randomUUID(),
      items: [],

      hydrate: async () => {
        const { sessionId } = get();
        if (!sessionId) return;
        try {
          const res = await fetch(`/api/cart?sessionId=${sessionId}`);
          if (!res.ok) return;
          const data = await res.json();
          set({ items: data.items || [] });
        } catch {
          // silent fail on hydration
        }
      },

      setMode: (mode, id) => set({ mode, userId: id, sessionId: mode === 'guest' ? crypto.randomUUID() : undefined }),

      addItem: async ({ productId, variantId, quantity = 1 }) => {
        const { sessionId, userId, items } = get();
        // Optimistic update
        const existing = items.find(i => i.productId === productId && i.variantId === variantId);
        if (existing) {
          set({ items: items.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({ items: [...items, { id: crypto.randomUUID(), productId, variantId, quantity,
            product: { id: productId, name: 'Loading…', slug: '', price: 0, images: [], category: '', variants: [] } as any,
          }]});
        }
        // Sync to server
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, variantId, quantity, sessionId, userId }),
          });
        } catch { /* ignore */ }
      },

      removeItem: async (id) => {
        const { sessionId, userId, items } = get();
        set({ items: items.filter(i => i.id !== id) });
        try {
          await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, sessionId, userId }) });
        } catch { /* ignore */ }
      },

      updateQuantity: async (id, quantity) => {
        const { sessionId, userId, items } = get();
        if (quantity <= 0) return get().removeItem(id);
        set({ items: items.map(i => i.id === id ? { ...i, quantity } : i) });
        try {
          await fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, quantity, sessionId, userId }) });
        } catch { /* ignore */ }
      },

      clear: async () => {
        const { sessionId, userId } = get();
        set({ items: [] });
        try {
          await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, userId, clear: true }) });
        } catch { /* ignore */ }
      },

      subtotal: () => get().items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'newnation-cart',
      partialize: (s) => ({ mode: s.mode, userId: s.userId, sessionId: s.sessionId, items: s.items }),
    }
  )
);