import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


interface CategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {

    const { id } = await params;
    const category = await prisma.category.findUnique({ where: { id }, include: { products: { include: { images: true } } } });

    if (!category) notFound();

    return (
        <section className="section">
            <h3>{category.name}</h3>
            <div className="features">
                {category.products.map((product) => (
                    <div key={product.id} className="feature-card">
                        <h4>{product.name}</h4>
                        <p>
                            <img src={product.images[0].url} alt={product.images[0].alt || ""} width={100} height={100} />
                        </p>
                        <p>${product.price.toString()}</p>
                        <a className="cta" href={`/products/${product.id}`}>
                            View Product
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
