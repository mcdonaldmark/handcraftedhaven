export default function ShopPage() {
  const products = [
    {
      id: 1,
      name: "Ceramic Mug",
      price: 28,
      category: "Ceramics",
      sellerId: 1,
    },
    {
      id: 2,
      name: "Woven Wall Art",
      price: 65,
      category: "Textiles",
      sellerId: 2,
    },
    {
      id: 3,
      name: "Leather Journal",
      price: 42,
      category: "Leather",
      sellerId: 1,
    },
  ];

  return (
    <section className="section">
      <h3>Shop Handmade Goods</h3>

      {/* Filters */}
      <div className="feature-card" style={{ marginBottom: "2rem" }}>
        <strong>Filter Products</strong>
        <p>Category and price filters will be applied here.</p>
      </div>

      <div className="features">
        {products.map((product) => (
          <div key={product.id} className="feature-card">
            <h4>{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>${product.price}</p>

            <a className="cta" href={`/products/${product.id}`}>
              View Product
            </a>

            <p style={{ marginTop: "0.5rem" }}>
              <a href={`/sellers/${product.sellerId}`}>View Artisan</a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
