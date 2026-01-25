"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [role, setRole] = useState<"customer" | "artisan">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Signup failed");
      return;
    }

    router.push("/login");
  }

  return (
    <section className="section" style={{ maxWidth: 600 }}>
      <h3>Create an Account</h3>

      <form className="feature-card" onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            <strong>Account Type</strong>
          </legend>

          <label>
            <input
              type="radio"
              checked={role === "customer"}
              onChange={() => setRole("customer")}
            />{" "}
            Customer
          </label>

          <label>
            <input
              type="radio"
              checked={role === "artisan"}
              onChange={() => setRole("artisan")}
            />{" "}
            Artisan
          </label>
        </fieldset>

        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="cta" type="submit">
          Create Account
        </button>
      </form>
    </section>
  );
}
