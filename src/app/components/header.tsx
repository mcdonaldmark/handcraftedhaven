"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="site-header">
      <h1>Handcrafted Haven</h1>

      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/categories">Categories</Link>
          </li>

          {session?.user?.role === "artisan" && (
            <li>
              <Link href="/seller/dashboard">Dashboard</Link>
            </li>
          )}

          {!session && (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}

          {session && (
            <li>
              <button onClick={() => signOut()} className="cta">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
