'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCartStore, useUIStore } from '@/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrateCart = useCartStore(s => s.hydrate);
  const setPageLoading = useUIStore(s => s.setPageLoading);

  useEffect(() => {
    hydrateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPageLoading(false);
  }, [pathname, setPageLoading]);

  return <>{children}</>;
}