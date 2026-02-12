"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
}

export default function ConfirmationPage() {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);

  const isArtisan = session?.user.role === "artisan";

  useEffect(() => {
    const demoOrder: Order = {
      id: crypto.randomUUID(),
      items: [
        { id: 1, name: "Handmade Necklace", price: 45, quantity: 2 },
        { id: 2, name: "Ceramic Mug", price: 30, quantity: 1 },
      ],
      total: 120,
    };
    setOrder(demoOrder);
  }, []);

  if (!session) {
    return (
      <div className="section">
        <h3>Please log in to view your order confirmation.</h3>
        <Link href="/login" className="cta">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Thank you for your purchase, {session.user.name}!</h2>
      <p>
        {isArtisan
          ? "Your products have been successfully listed for sale."
          : "Your order has been successfully placed."}
      </p>

      {order && (
        <div className="order-summary" style={{ marginTop: "2rem" }}>
          <h3>Order Summary</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                {item.name} x {item.quantity} — ${item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p style={{ fontWeight: 600, marginTop: "1rem" }}>
            Total: ${order.total}
          </p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <Link href={isArtisan ? "/seller/dashboard" : "/shop"} className="cta">
          {isArtisan ? "Go to Dashboard" : "Continue Shopping"}
        </Link>
      </div>
    </div>
  );
}
