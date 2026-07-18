'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore, useWishlistStore } from '@/store';
import { useUIStore } from '@/store';

export default function Nav() {
  const pathname = usePathname();
  const count = useCartStore(s => s.count());
  const wishCount = useWishlistStore(s => s.items.length);
  const toggleCart = useUIStore(s => s.toggleCart);
  const toggleTheme = useUIStore(s => s.toggleTheme);
  const openSearch = useUIStore(s => s.setSearchOpen);

  return (
    <header className="nav" id="nav">
      <div className="nav-inner">
        <Link className="logo" href="/">New Nation</Link>
        <nav className="nav-links">
          <Link className="nav-link" href="/shop">Shop</Link>
          <Link className="nav-link" href="/shop">Featured</Link>
          <Link className="nav-link" href="/shop">Sale</Link>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => openSearch(true)} aria-label="Search">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Theme">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          </button>
          <Link className="icon-btn" href="/account" aria-label="Wishlist">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>
            <span className="icon-badge" id="wishBadge">{wishCount}</span>
          </Link>
          <button className="icon-btn" onClick={toggleCart} aria-label="Cart">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="icon-badge" id="cartBadge">{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}