import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface SellerPageProps {
  params: Promise<{ id: string | string[] }>; // ✅ params is a Promise
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { id: rawId } = await params; // ✅ await the promise

  // Ensure id exists and is a string
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id) notFound();

  // Fetch artisan by unique id
  const artisan = await prisma.user.findUnique({
    where: { id },
    include: {
      products: {
        include: { images: true },
      },
    },
  });

  if (!artisan || artisan.role !== "artisan") notFound();

  return (
    <section className="section">
      <h3>Artisan Profile</h3>
      <div className="feature-card">
        <h4>{artisan.name}</h4>
        <p style={{ fontStyle: "italic", textAlign: "left" }}>
          {artisan.bio || "No bio provided."}
        </p>
        <p>
          <strong>Shop: </strong>
          {artisan.shopName || "N/A"}
        </p>
      </div>

      <h3>Products by This Artisan</h3>
      {artisan.products.length === 0 && <p>No products yet.</p>}
      <div
        className="features"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {artisan.products.map((product) => (
          <div key={product.id} className="feature-card">
            <h4>{product.name}</h4>
            <p>${product.price.toString()}</p>
            {product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <a className="cta" href={`/products/${product.id}`}>
              View Product
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
