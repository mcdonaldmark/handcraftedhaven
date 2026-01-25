"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
  }

  return (
    <section className="section" style={{ maxWidth: 500 }}>
      <h3>Login</h3>

      <form
        className="feature-card"
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "1rem" }}
      >
        <label style={{ display: "block" }}>
          Email
          <input
            className="auth-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
        </label>

        <label style={{ display: "block" }}>
          Password
          <input
            className="auth-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="cta" type="submit" style={{ marginTop: "0.5rem" }}>
          Login
        </button>
      </form>

      {/* Sign-up gateway */}
      <div
        className="feature-card"
        style={{ marginTop: "2rem", textAlign: "center" }}
      >
        <p>New to Handcrafted Haven?</p>
        <a className="cta" href="/signup">
          Create an Account
        </a>
      </div>
    </section>
  );
}
