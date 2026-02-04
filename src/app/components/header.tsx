"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <h1>Handcrafted Haven</h1>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav className={menuOpen ? "open" : ""}>
        <ul onClick={closeMenu}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/categories">Categories</Link>
          </li>

          {/* Only show Cart link if user is logged in */}
          {session?.user?.role && (
            <li>
              <Link href="/cart">Cart</Link>
            </li>
          )}

          {!session ? (
            <li>
              <Link href="/login">Login</Link>
            </li>
          ) : (
            <>
              {session.user?.role === "artisan" && (
                <li>
                  <Link href="/seller/dashboard">Dashboard</Link>
                </li>
              )}

              <li>
                <Link href="/profile">My Profile</Link>
              </li>

              <li>
                <button
                  className="nav-logout"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    color: "inherit",
                    font: "inherit",
                  }}
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
