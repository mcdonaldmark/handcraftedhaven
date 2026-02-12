"use client";

import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<CartItem[]>([]);
  const [userType, setUserType] = useState<"customer" | "artisan">("customer");

  useEffect(() => {
    // Retrieve the latest order from localStorage
    const storedOrder = localStorage.getItem("latest_order");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }

    // Retrieve user type from localStorage or default to customer
    const storedUserType = localStorage.getItem("user_type");
    if (storedUserType === "artisan" || storedUserType === "customer") {
      setUserType(storedUserType);
    }
  }, []);

  const totalPrice = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <section
      className="section"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "1.5rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "1rem",
        }}
      >
        Order Confirmation
      </h3>

      <p
        style={{
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          padding: "10px 15px",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          fontSize: "14px",
        }}
      >
        {userType === "artisan"
          ? "Thank you for updating your inventory! Your products have been successfully processed."
          : "Thank you for your purchase! Your order has been successfully placed."}
      </p>

      {order.length === 0 ? (
        <p style={{ color: "#888", textAlign: "center", padding: "3rem 0" }}>
          No order found.
        </p>
      ) : (
        <div>
          {order.map((item) => (
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
                border: "1px solid #f0f0f0",
              }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width={70}
                  height={70}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}
                />
              )}

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  {item.name}
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                  Qty: {item.quantity} | Price: ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              textAlign: "right",
              marginTop: "1rem",
            }}
          >
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
      )}
    </section>
  );
}
