import Reviews from "@/app/components/reviews";

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <>
      <section className="section">
        <h3>Product Details</h3>

        <div className="feature-card">
          <h4>Handmade Product #{params.id}</h4>

          <p>
            This handcrafted item was created by a skilled artisan using
            traditional techniques and premium materials.
          </p>

          <p>
            <strong>Price:</strong> $45
          </p>

          <p>
            <a href="/sellers/1">View Artisan Profile</a>
          </p>
        </div>
      </section>

      <Reviews />
    </>
  );
}
