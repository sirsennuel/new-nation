import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">New Nation</div>
            <p>Premium print-on-demand essentials — elevated apparel, accessories and home goods.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop">Templates</Link></li>
              <li><Link href="/shop">Tools</Link></li>
              <li><Link href="/shop">Courses</Link></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li>FAQ</li>
              <li>Contact</li>
              <li>Shipping</li>
              <li>Returns</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Press</li>
              <li>Privacy Policy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 New Nation Entertainment.</span>
          <span>Built with purpose.</span>
        </div>
      </div>
    </footer>
  );
}