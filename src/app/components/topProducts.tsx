"use client";

import { useEffect, useState } from "react";

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
                    <div key={product.id} className="feature-card" style={{ position: 'relative' }}>

                        <div className="feature-card__image">
                            <img
                                src={product.images[0]?.url || "/placeholder.jpg"}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '0.5rem 0' }}>
                                <span style={{ color: '#ffcc00' }}>★</span>
                                <strong style={{ fontSize: '0.9rem' }}>
                                    {Number(product.avgRating || 0).toFixed(1)}
                                </strong>
                                <span style={{ color: '#999', fontSize: '0.8rem' }}>
                                    ({product._count.reviews})
                                </span>
                            </div>
                        </div>

                        <div className="feature-card__content">
                            <span className="feature-card__category">{product.category.name}</span>

                            <h4 className="feature-card__title">
                                {product.name}
                            </h4>



                            <div className="feature-card__footer">
                                <span className="feature-card__price">${Number(product.price).toFixed(2)}</span>
                                <a href={`/products/${product.id}`} className="cta">
                                    View Product
                                </a>
                            </div>



                            <a href={`/sellers/${product.artisan.id}`} className="feature-card__artisan">
                                by {product.artisan.name}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}