'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <h1>Handcrafted Haven</h1>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        title={menuOpen ? "Close menu" : "Open menu"}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <nav className={menuOpen ? 'open' : ''}>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/categories">Categories</Link></li>
          <li><Link href="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}
