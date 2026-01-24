export default function CategoriesPage() {
  const categories = [
    "Ceramics",
    "Textiles",
    "Home Decor",
    "Jewelry",
    "Art Prints",
  ];

  return (
    <section className="section">
      <h3>Browse by Category</h3>

      <div className="features">
        {categories.map((category) => (
          <div key={category} className="feature-card">
            <h4>{category}</h4>
            <p>Explore handmade {category.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
