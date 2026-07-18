'use client';
import { create } from 'zustand';

export interface UIStore {
  pageLoading: boolean;
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  cartOpen: boolean;
  theme: 'light' | 'dark';
  setPageLoading: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  toggleMobileMenu: () => void;
  toggleCart: () => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  pageLoading: false,
  searchOpen: false,
  mobileMenuOpen: false,
  cartOpen: false,
  theme: 'light',
  setPageLoading: (pageLoading) => set({ pageLoading }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  toggleMobileMenu: () => set(s => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  toggleCart: () => set(s => ({ cartOpen: !s.cartOpen })),
  toggleTheme: () => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      set({ theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' });
    }
  },
}));