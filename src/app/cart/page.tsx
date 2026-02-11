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

    const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);

    try {
      const res = await fetch("/api/cart", { headers: { "x-session-id": sessionId } });


      const data = await res.json();
      console.log('data', data);
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

      const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
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
    <section className="section" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        My Cart
      </h3>

      {message && (
        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px 15px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '14px' }}>
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="feature-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                border: "1px solid #f0f0f0"
              }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width={70}
                  height={70}
                  style={{ objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                />
              )}


              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>


                <div style={{ flex: 1, textAlign: "left" }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#333', fontWeight: '600' }}>
                    {item.name}
                  </h4>
                </div>


                <div style={{ width: "120px", textAlign: "right", flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    <span style={{ fontWeight: 600, color: '#000' }}>${item.price.toFixed(2)}</span>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>


              <button
                onClick={() => handleRemove(item.id)}
                style={{
                  backgroundColor: "transparent",
                  color: "#ff4d4f",
                  border: "1px solid #ff4d4f",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "500",
                  flexShrink: 0
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={{ marginTop: '2rem', padding: '1.5rem', borderTop: '2px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <p style={{ fontSize: '1.25rem', margin: 0 }}>
              Total: <span style={{ fontWeight: 700 }}>${totalPrice.toFixed(2)}</span>
            </p>

            <button
              style={{
                marginTop: "1.5rem",
                backgroundColor: "#111",
                color: "#fff",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                width: "100%",
                maxWidth: "300px"
              }}
              onClick={() => alert("Checkout flow coming soon!")}
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
