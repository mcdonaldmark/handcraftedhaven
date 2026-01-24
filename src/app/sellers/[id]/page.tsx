interface SellerPageProps {
  params: { id: string };
}

export default function SellerPage({ params }: SellerPageProps) {
  const products = [
    { id: 1, name: "Ceramic Mug", price: 28 },
    { id: 2, name: "Clay Vase", price: 55 },
  ];

  return (
    <section className="section">
      <h3>Artisan Profile</h3>

      <div className="feature-card">
        <h4>Artisan #{params.id}</h4>
        <p>
          Passionate creator specializing in handcrafted ceramics inspired by
          nature and simplicity.
        </p>
      </div>

      <h3>Products by This Artisan</h3>

      <div className="features">
        {products.map((product) => (
          <div key={product.id} className="feature-card">
            <h4>{product.name}</h4>
            <p>${product.price}</p>
            <a className="cta" href={`/products/${product.id}`}>
              View Product
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
