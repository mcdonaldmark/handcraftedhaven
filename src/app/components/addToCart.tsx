"use client";

import { useToast } from "./toast/ToastContext";


interface Props {
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
    };
}

export default function AddToCartButton({ product }: Props) {
    const showToast = useToast();

    const handleAdd = async () => {
        const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
        localStorage.setItem("session_id", sessionId);

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-session-id": sessionId },
                body: JSON.stringify(product),
            });

            if (res.ok) {
                showToast(`${product.name} added to cart!`, "success");
            }
        } catch (err) {
            showToast("Error adding to cart", "error");
        }
    };

    return (
        <button
            onClick={handleAdd}
            style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#7a9b8e",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                marginTop: "1.5rem"
            }}
        >
            Add to Cart
        </button>
    );
}