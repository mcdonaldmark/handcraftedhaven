"use client";

export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user?.role !== "artisan") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user?.role !== "artisan") return null;

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
