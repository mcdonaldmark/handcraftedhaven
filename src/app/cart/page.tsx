"use client";

import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        setMessage("Item removed from cart.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section className="section">
      <h3>My Cart</h3>

      {message && (
        <p style={{ color: "green", fontWeight: 600, marginBottom: "1rem" }}>
          {message}
        </p>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="feature-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
                )}
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <p style={{ fontWeight: 600 }}>Total: ${totalPrice.toFixed(2)}</p>

          <button
            style={{
              marginTop: "1rem",
              backgroundColor: "#27ae60",
              color: "#fff",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => alert("Checkout flow coming soon!")}
          >
            Checkout
          </button>
        </div>
      )}
    </section>
  );
}
