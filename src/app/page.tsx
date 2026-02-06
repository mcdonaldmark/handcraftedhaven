import TopRatedProducts from "./components/topProducts";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h2>Discover Unique Handmade Creations</h2>
        <p>
          Handcrafted Haven connects passionate artisans with customers who
          value creativity, quality, and originality.
        </p>
        <a className="cta" href="/shop">
          Start Shopping
        </a>
      </section>

      <section className="section">
        <TopRatedProducts />
      </section>

      <section className="section">
        <h3>Why Handcrafted Haven?</h3>
        <div className="features">
          <div className="feature-card">
            <h4>Support Artisans</h4>
            <p>
              Buy directly from independent creators and support small
              businesses.
            </p>
          </div>
          <div className="feature-card">
            <h4>Unique Products</h4>
            <p>
              Discover one-of-a-kind handmade items you won’t find anywhere
              else.
            </p>
          </div>
          <div className="feature-card">
            <h4>Secure Shopping</h4>
            <p>
              Enjoy a safe and user-friendly shopping experience from start to
              finish.
            </p>
          </div>
        </div>
      </section>



      <section className="section about">
        <h3>About Handcrafted Haven</h3>
        <p>
          Handcrafted Haven is a full-stack web application designed as an
          online marketplace for handmade goods. Our mission is to empower
          artisans and provide shoppers with a seamless experience.
        </p>
      </section>
    </>
  );
}
