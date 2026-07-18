'use client';
import { create } from 'zustand';
import type { ProductModel } from '@/types';

export interface WishlistStore {
  items: ProductModel[];
  isWishlisted: (id: string) => boolean;
  toggle: (product: ProductModel) => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isWishlisted: (id) => get().items.some(i => i.id === id),
  toggle: (product) => set({ items: get().isWishlisted(product.id) ? get().items.filter(i => i.id !== product.id) : [...get().items, product] }),
}));