'use client';
import { useCartStore } from '@/store';
import CartDrawer from '@/components/cart/cart-drawer';

export default function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}