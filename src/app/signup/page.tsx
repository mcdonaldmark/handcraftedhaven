"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [role, setRole] = useState<"customer" | "artisan">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role,
        name,
        shopName,
        bio,
      }),
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

      <form className="feature-card auth-form" onSubmit={handleSubmit}>
        <fieldset className="auth-radio-group">
          <legend>
            <strong>Account Type</strong>
          </legend>

          <label>
            <input
              type="radio"
              checked={role === "customer"}
              onChange={() => setRole("customer")}
            />
            Customer
          </label>

          <label>
            <input
              type="radio"
              checked={role === "artisan"}
              onChange={() => setRole("artisan")}
            />
            Artisan
          </label>
        </fieldset>

        <label className="auth-field">
          Full Name
          <input
            className="auth-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </label>

        <label className="auth-field">
          Email
          <input
            className="auth-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="auth-field">
          Password
          <input
            className="auth-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {role === "artisan" && (
          <>
            <label className="auth-field">
              Your Shop Name
              <input
                className="auth-input"
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Your shop name"
                required
              />
            </label>

            <label className="auth-field">
              Artisan Bio
              <textarea
                className="auth-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your craft..."
                rows={4}
                required
              />
            </label>
          </>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="cta" type="submit">
          Create Account
        </button>
      </form>
    </section>
  );
}
