"use client";

import { useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState<"customer" | "artisan">("customer");

  return (
    <section className="section" style={{ maxWidth: 600 }}>
      <h3>Create an Account</h3>

      <form className="feature-card">
        {/* Role selection */}
        <fieldset>
          <legend>
            <strong>Account Type</strong>
          </legend>

          <label style={{ display: "block", marginTop: "0.5rem" }}>
            <input
              type="radio"
              name="role"
              value="customer"
              checked={role === "customer"}
              onChange={() => setRole("customer")}
            />{" "}
            Customer (Shop & review products)
          </label>

          <label style={{ display: "block", marginTop: "0.5rem" }}>
            <input
              type="radio"
              name="role"
              value="artisan"
              checked={role === "artisan"}
              onChange={() => setRole("artisan")}
            />{" "}
            Artisan (Sell handmade goods)
          </label>
        </fieldset>

        {/* Common fields */}
        <label style={{ display: "block", marginTop: "1rem" }}>
          Email
          <input type="email" required style={{ width: "100%" }} />
        </label>

        <label style={{ display: "block", marginTop: "1rem" }}>
          Password
          <input type="password" required style={{ width: "100%" }} />
        </label>

        {/* Artisan-only fields */}
        {role === "artisan" && (
          <>
            <label style={{ display: "block", marginTop: "1rem" }}>
              Shop Name
              <input type="text" style={{ width: "100%" }} />
            </label>

            <label style={{ display: "block", marginTop: "1rem" }}>
              Artisan Bio
              <textarea rows={4} style={{ width: "100%" }} />
            </label>
          </>
        )}

        <button className="cta" style={{ marginTop: "1.5rem" }}>
          Create Account
        </button>
      </form>
    </section>
  );
}
