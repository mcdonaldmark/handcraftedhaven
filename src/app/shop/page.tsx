"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "../components/toast/ToastContext";

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
  averageRating: number;
  reviewCount: number;
  artisan: { name: string; id: string };
}

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const showToast = useToast();
  const router = useRouter();

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

    const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0]?.url,
        }),
      });

      if (res.ok) {
        showToast(`${product.name} has been added to your cart!`, "success");
      } else {
        showToast("Failed to add to cart.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error adding to cart.", "error");
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
            onClick={() => router.push(`/products/${product.id}`)}
            style={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              position: "relative",
              padding: "1rem",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: "1px solid #f0f0f0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "200px", marginBottom: "1rem" }}>
              <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: "0.25rem", backgroundColor: "#fff", top: "0.25rem", right: "0.25rem", color: "rgb(255, 204, 0)", fontWeight: "bold", padding: "0.25rem", borderRadius: "8px" }}>
                ★
                <span style={{ color: "#000" }}>{product?.averageRating.toFixed(2) || 0}</span>
                <span style={{ color: "#000" }}>({product?.reviewCount || 0})</span>
              </div>
              {product.images[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt ?? product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>

            <div style={{ flexGrow: 1, marginBottom: "1rem" }}>
              <span className="feature-card__category">{product.category.name}</span>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "#333" }}>{product.name}</h4>
              <small>By {product?.artisan?.name}</small>
              <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#2c3e50" }}>
                ${product.price.toFixed(2)}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBuyItNow(product);
              }}
              style={{
                width: "100%",
                padding: "0.8rem",
                backgroundColor: "#7a9b8e",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#333")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#7a9b8e")}
            >
              Add to Cart
            </button>
          </div>
        ))}

      </div>
    </section>
  );
}
