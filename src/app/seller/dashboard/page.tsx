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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setMessage("");
    if (!name || !price || !categoryId || imageFiles.length === 0) {
      setMessage("All fields including at least one image are required.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("artisanId", session.user.id);

    // Append all images
    imageFiles.forEach((file) => formData.append("images", file));

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
      setImageFiles([]);
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    setImageFiles((prev) => {
      // Prevent duplicates based on file name + size
      const filtered = newFiles.filter(
        (newFile) =>
          !prev.some(
            (file) => file.name === newFile.name && file.size === newFile.size,
          ),
      );
      return [...prev, ...filtered];
    });

    // Reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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

        {/* Centered multiple file upload */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <label
            htmlFor="image-upload"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              backgroundColor: "#f4f4f4",
              cursor: "pointer",
            }}
          >
            Upload Product Images
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Show thumbnails of all selected images */}
        {imageFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.5rem",
              justifyContent: "center",
            }}
          >
            {imageFiles.map((file, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
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
          {isSubmitting ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </section>
  );
}
