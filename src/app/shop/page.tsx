"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: { id: string; name: string };
  images: { id: string; url: string | null; alt: string | null }[];
  artisanId: string;
}

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch products and categories from API routes
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
        ]);
        const catData: Category[] = await catRes.json();
        const prodDataRaw: any[] = await prodRes.json();

        // Convert Decimal to number if using Prisma
        const prodData: Product[] = prodDataRaw.map((p) => ({
          ...p,
          price: Number(p.price),
        }));

        setCategories(catData);
        setProducts(prodData);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category.id === selectedCategory)
    : products;

  if (!products || !categories) return <p>Loading...</p>;

  return (
    <section className="section">
      <h3>Shop Handmade Goods</h3>

      {/* Filters */}
      <div className="feature-card" style={{ marginBottom: "2rem" }}>
        <strong>Filter Products</strong>
        <div style={{ marginTop: "0.5rem" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: "100%", height: "50px" }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <p style={{ marginTop: "0.5rem" }}>
          Showing {filteredProducts.length} handcrafted items.
        </p>
      </div>

      <div className="features">
        {filteredProducts.map((product) => (
          <div key={product.id} className="feature-card">
            {product.images[0] && (
              <img
                src={product.images[0].url || ""}
                alt={product.images[0].alt || product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />
            )}
            <h4>{product.name}</h4>
            <p>Category: {product.category.name}</p>
            <p>
              <strong>${product.price.toFixed(2)}</strong>
            </p>
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
