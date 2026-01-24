"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();

  // Wait for auth to resolve
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Not logged in
  if (!session) {
    redirect("/login");
  }

  // Logged in but not an artisan
  if (session.user.role !== "artisan") {
    redirect("/");
  }

  return (
    <section className="section">
      <h3>Seller Dashboard</h3>

      <form className="feature-card">
        <label>
          Product Name
          <input type="text" style={{ width: "100%" }} />
        </label>

        <label style={{ marginTop: "1rem", display: "block" }}>
          Description
          <textarea rows={4} style={{ width: "100%" }} />
        </label>

        <label style={{ marginTop: "1rem", display: "block" }}>
          Price
          <input type="number" style={{ width: "100%" }} />
        </label>

        <button className="cta" style={{ marginTop: "1.5rem" }}>
          Add Product
        </button>
      </form>
    </section>
  );
}
