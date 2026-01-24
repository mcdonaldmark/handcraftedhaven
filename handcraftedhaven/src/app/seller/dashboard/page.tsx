export default function SellerDashboardPage() {
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
