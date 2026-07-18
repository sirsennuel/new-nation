import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export function generateOrderNumber() {
  const now = new Date();
  const ts = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `NN-${ts}-${rand}`;
}

export function fallbackImage(title: string) {
  return `https://placehold.co/800x1000/eeeeee/555555?text=${encodeURIComponent(title)}`;
}

export function buildSeo({ title, description, image, path = '' }: { title?: string; description?: string; image?: string; path?: string }) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://newnation.store';
  const url = `${base}${path}`;
  return {
    title: title ? `${title} | New Nation` : 'New Nation — Premium Essentials',
    description: description || 'Premium design systems, tools, courses and cinematic templates.',
    openGraph: {
      url,
      title,
      description,
      image: image || `${base}/og.png`,
      siteName: 'New Nation',
    },
    alternates: { canonical: url },
  };
}