"use client";

export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user?.role !== "artisan") {
      router.push("/");
      return;
    }

    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    fetchCategories();
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user?.role !== "artisan") return null;

  const handleAddUrl = () => {
    if (!currentUrl) return;
    if (imageUrls.includes(currentUrl)) return;
    setImageUrls((prev) => [...prev, currentUrl]);
    setCurrentUrl("");
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name || !price || !categoryId || imageUrls.length === 0) {
      setMessage("All fields including at least one image URL are required.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("artisanId", session.user.id);

    imageUrls.forEach((url) => formData.append("imageUrls", url));

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to add product.");
        setIsSubmitting(false);
        return;
      }

      setMessage("Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setImageUrls([]);
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section">
      <h3>Seller Dashboard</h3>

      {message && (
        <p style={{ marginBottom: "1rem", color: "#2c3e50" }}>{message}</p>
      )}

      <form
        className="feature-card"
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "1rem" }}
      >
        <label>
          Product Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", height: "65px" }}
          />
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", height: "65px" }}
          />
        </label>

        <label>
          Image URL
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              placeholder="Enter image URL"
              style={{ width: "100%", height: "65px" }}
            />
            <button type="button" onClick={handleAddUrl}>
              Add
            </button>
          </div>
        </label>

        {imageUrls.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.5rem",
              justifyContent: "center",
            }}
          >
            {imageUrls.map((url, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={url}
                  alt={`image-${idx}`}
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(idx)}
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label>
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            style={{ width: "100%", height: "65px" }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <button
          className="cta"
          style={{ marginTop: "1.5rem" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </section>
  );
}
