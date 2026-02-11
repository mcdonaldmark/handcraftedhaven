"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./toast/ToastContext";

interface TopProduct {
    id: string;
    name: string;
    price: number;
    avgRating: number;
    category: { name: string };
    images: { url: string }[];
    artisan: { id: string; name: string };
    _count: { reviews: number };
}

export default function TopRatedProducts() {
    const [products, setProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const showToast = useToast();


    const handleBuyItNow = async (product: TopProduct) => {

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

    useEffect(() => {
        async function loadTopProducts() {
            try {
                const response = await fetch("/api/products/top-rated");
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        }

        loadTopProducts();
    }, []);

    if (loading) {
        return (
            <section className="section" style={{ textAlign: "center", padding: "4rem" }}>
                <p>Loading our favorites...</p>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#2c3e50' }}>Customer Favorites</h2>
                <p style={{ color: '#666' }}>Our highest-rated handcrafted pieces</p>
            </div>

            <div className="product-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "2rem"
            }}>
                {products.map((product) => (
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
                                <span style={{ color: "#000" }}>{product?.avgRating?.toFixed(2) || 0}</span>
                                <span style={{ color: "#000" }}>({product?._count?.reviews || 0})</span>
                            </div>
                            {product.images[0] && (
                                <img
                                    src={product.images[0].url}
                                    alt={product.name || "Product Image"}
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
        </>
    );
}