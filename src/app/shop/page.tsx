import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: {
        take: 1,
      },
    }
  });

  return (
    <section className="section">
      <h3>Shop Handmade Goods</h3>

      {/* Filters */}
      <div className="feature-card" style={{ marginBottom: "2rem" }}>
        <strong>Filter Products</strong>
        <p>Showing {products.length} unique handcrafted items.</p>
      </div>

      <div className="features">
        {products.map((product) => (
          <div key={product.id} className="feature-card">
            {product.images.length > 0 && (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
              />
            )}

            <h4>{product.name}</h4>
            <p>Category: {product.category.name}</p>
            <p><strong>${product.price.toString()}</strong></p>

            <a className="cta" href={`/products/${product.id}`}>
              View Product
            </a>

            <p style={{ marginTop: "0.5rem" }}>
              <a href={`/sellers/${product.artisanId}`}>View Artisan</a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}