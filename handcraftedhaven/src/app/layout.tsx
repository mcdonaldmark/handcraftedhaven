import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';


export const metadata: Metadata = {
title: 'Handcrafted Haven',
description: 'An online marketplace for handmade goods',
};


export default function RootLayout({
  children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>
            <header className="site-header">
              <h1>Handcrafted Haven</h1>
                <nav>
                  <ul>
                     <li><Link href="/">Home</Link></li>
                    <li><Link href="/shop">Shop</Link></li>
                    <li><Link href="/categories">Categories</Link></li>
                    <li><Link href="/login">Login</Link></li>
                  </ul>
                </nav>
            </header>


          <main>{children}</main>


<footer className="site-footer">
<p>&copy; 2026 Handcrafted Haven | WDD 430 Team Project</p>
</footer>
</body>
</html>
);
}