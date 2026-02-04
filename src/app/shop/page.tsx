"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string; alt?: string | null }[];
  category: Category;
}

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
      ]);

      const catData: Category[] = await catRes.json();
      const prodData: Product[] = await prodRes.json();

      setCategories(catData);
      setProducts(prodData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuyItNow = async (product: Product) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0]?.url,
        }),
      });

      if (res.ok) {
        alert(`${product.name} has been added to your cart!`);
      } else {
        alert("Failed to add to cart.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to cart.");
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category.id === selectedCategory)
    : products;

  return (
    <section className="section">
      <h2>Shop</h2>

      <div style={{ marginBottom: "1rem" }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="feature-card"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                }}
              />
            )}

            <h4>{product.name}</h4>
            <p>${product.price.toFixed(2)}</p>

            <Link
              href={`/products/${product.id}`}
              style={{
                textAlign: "center",
                padding: "0.75rem",
                backgroundColor: "#7A9B8E",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                marginTop: "0.5rem",
              }}
            >
              View Product
            </Link>

            <button
              onClick={() => handleBuyItNow(product)}
              style={{
                textAlign: "center",
                padding: "0.75rem",
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                marginTop: "0.5rem",
              }}
            >
              Buy It Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
