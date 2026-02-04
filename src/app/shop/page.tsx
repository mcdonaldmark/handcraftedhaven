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

            {/* Image */}
            {product.images.length > 0 && (
              <div className="feature-card__image">
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  loading="lazy"
                />
              </div>
            )}

            {/* Content */}
            <div className="feature-card__content">

              <span className="feature-card__category">
                {product.category.name}
              </span>

              <h4 className="feature-card__title">
                {product.name}
              </h4>

              <div className="feature-card__footer">
                <span className="feature-card__price">
                  ${product.price.toString()}
                </span>

                <a className="cta" href={`/products/${product.id}`}>
                  View Product
                </a>
              </div>

              <a
                className="feature-card__artisan"
                href={`/sellers/${product.artisanId}`}
              >
                View Artisan
              </a>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
}