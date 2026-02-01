import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {

  const categories = await prisma.category.findMany();

  return (
    <section className="section">
      <h3>Browse by Category</h3>
      <div className="features">
        {categories.map((category) => (
          <div key={category.id} className="feature-card">
            <h4>{category.name}</h4>
            <p>Explore {category.name.toLowerCase()}.</p>
            <a className="cta" href={`/categories/${category.id}`}>
              View Category
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
