import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Providers from './providers';
import Nav from '@/components/layout/nav';
import Footer from '@/components/layout/footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://newnation.store'),
  title: { default: 'New Nation — Premium Essentials', template: '%s | New Nation' },
  description: 'A luxury print-on-demand brand. Premium apparel, accessories, and home goods — fulfilled by Printful.',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'New Nation' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#0c0c0c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}