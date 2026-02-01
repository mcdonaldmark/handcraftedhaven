import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface SellerPageProps {
  params: { id: string }; // ✅ Correct typing
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { id } = params;

  const artisan = await prisma.user.findFirst({
    where: { id, role: "artisan" },
    include: {
      products: {
        include: { images: true },
      },
    },
  });

  if (!artisan) notFound();

  return (
    <section className="section">
      <h3>Artisan Profile</h3>
      <div className="feature-card">
        <h4>{artisan.name}</h4>
        <p style={{ fontStyle: "italic", textAlign: "left" }}>{artisan.bio}</p>
        <p>
          <strong>Shop: </strong>
          {artisan.shopName}
        </p>
      </div>

      <h3>Products by This Artisan</h3>
      <div className="features">
        {artisan.products.map((product) => (
          <div key={product.id} className="feature-card">
            <h4>{product.name}</h4>
            <p>${product.price.toString()}</p>
            {product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || ""}
                width={100}
                height={100}
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
