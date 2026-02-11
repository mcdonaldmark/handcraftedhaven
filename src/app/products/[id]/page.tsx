

import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Reviews from "@/app/components/reviews";
import Gallery from "@/app/components/gallery";
import AddToCartButton from "@/app/components/addToCart";

const prisma = new PrismaClient();

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      artisan: true,
      images: true,
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!product) notFound();

  return (
    <>
      <section className="section">
        <div
          className="product-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          <Gallery images={product.images} productName={product.name} />


          <div className="details">
            <span
              style={{
                color: "#666",
                textTransform: "uppercase",
                fontSize: "0.8rem",
                letterSpacing: "1px",
              }}
            >
              {product.category.name}
            </span>
            <h1 style={{ marginTop: "0.5rem", fontSize: "2.5rem" }}>
              {product.name}
            </h1>

            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#2c3e50",
                margin: "1rem 0",
              }}
            >
              ${product.price.toString()}
            </p>

            <div
              className="feature-card"
              style={{
                padding: "2rem",
                background: "#f9f9f9",
                borderRadius: "12px",
              }}
            >
              <p style={{ lineHeight: "1.6", color: "#444" }}>
                {product.description}
              </p>
              <hr style={{ margin: "1.5rem 0", opacity: 0.1 }} />
              By <a style={{ color: "#7a9b8e" }} href={`/sellers/${product.artisan.id}`} >{product.artisan.name}</a>
              <AddToCartButton product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                imageUrl: product.images[0]?.url,
              }} />
            </div>
          </div>
        </div>
      </section>

      <Reviews reviews={product.reviews} productId={product.id} />
    </>
  );
}
