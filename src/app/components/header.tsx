"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

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

      <nav className={menuOpen ? "open" : ""}>
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

          {!session && (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}

          {session && (
            <>
              {session.user.role === "artisan" && (
                <li>
                  <Link href="/seller/dashboard">Dashboard</Link>
                </li>
              )}
              <li>
                <button
                  className="nav-logout"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
