"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="site-header">
      <h1>Handcrafted Haven</h1>

      <button className="hamburger" onClick={() => setNavOpen(!navOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav className={navOpen ? "open" : ""}>
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
            <li>
              <Link href="/shop">Shop</Link>
            </li>
          )}

          {session ? (
            <>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
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
          ) : (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
