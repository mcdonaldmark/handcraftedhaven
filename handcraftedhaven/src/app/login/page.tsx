export default function LoginPage() {
  return (
    <section className="section" style={{ maxWidth: 500 }}>
      <h3>Login</h3>

      <form className="feature-card">
        <label>
          Email
          <input
            type="email"
            required
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
        </label>

        <label style={{ display: "block", marginTop: "1rem" }}>
          Password
          <input
            type="password"
            required
            style={{ width: "100%", marginTop: "0.25rem" }}
          />
        </label>

        <button className="cta" type="submit" style={{ marginTop: "1.5rem" }}>
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
