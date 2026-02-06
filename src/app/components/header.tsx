"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="logo">
        <Link href="/">Handcrafted Haven</Link>
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav className={menuOpen ? "open" : ""}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>

          {!session && (
            <li>
              <Link href="/categories">Categories</Link>
            </li>
          )}

          {session && (
            <>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
              {session.user?.role === "artisan" && (
                <li>
                  <Link href="/seller/dashboard">Dashboard</Link>
                </li>
              )}
            </>
          )}

          {!session && (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}

          {session && (
            <li>
              <button
                className="nav-logout"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
