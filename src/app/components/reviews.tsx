"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string;
  };
}

function StarRating({
  rating,
  setRating
}: {
  rating: number;
  setRating: (n: number) => void
}) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: "flex", gap: "5px", marginBottom: "1rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "2rem",
            padding: 0,
            color: star <= (hover || rating) ? "#ffcc00" : "#ccc",
            transition: "color 0.2s ease-in-out, transform 0.1s",
            transform: star <= hover ? "scale(1.1)" : "scale(1)",
          }}
        >
          ★
        </button>
      ))}
      <span style={{ marginLeft: "10px", alignSelf: "center", color: "#666" }}>
        {rating} of 5
      </span>
    </div>
  );
}

export default function Reviews({ reviews, productId }: { reviews: Review[]; productId: string }) {
  const { data: session, status } = useSession();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter()

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  console.log(productId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setComment("");
      setRating(5);
      router.refresh();


    } catch (error: any) {
      //console.error("REVIEW_POST_ERROR", error);  
      setError(error.message);

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section">
      <h3>Customer Reviews</h3>

      <div className="feature-card" style={{ marginBottom: "1.5rem" }}>
        <strong>Average Rating:</strong> {averageRating.toFixed(1)} ⭐ (
        {reviews.length} reviews)
      </div>

      <div className="features">
        {reviews.map((review) => (
          <div key={review.id} className="feature-card">
            <p>
              {"⭐".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
            <p>{review.comment}</p>
            <small>By {review.user.name} </small>
            <small> Reviewed on {new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      <h3>Leave a Review</h3>

      {status === "loading" && <p>Checking login status...</p>}

      {!session && status !== "loading" && (
        <div className="feature-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ textAlign: "center" }}>Please log in to leave a review.</p>
          <a className="cta" href="/login">Log In</a>
        </div>
      )}

      {session && (
        <form onSubmit={handleSubmit} className="feature-card">
          <label>
            <span style={{ fontWeight: "bold" }}>Please rate this product</span>
            <StarRating rating={rating} setRating={setRating} />
          </label>

          <label style={{ display: "block", marginTop: "1rem" }}>
            <span style={{ fontWeight: "bold" }}>Comment</span>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                marginTop: "0.5rem",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontFamily: "inherit",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2c3e50"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
              placeholder="What did you like or dislike?"
            />
          </label>


          {(error && !isSubmitting) && <p style={{ color: "red" }}>{error}</p>}

          <button
            className="cta"
            type="submit"
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "1rem",
              fontWeight: "bold"
            }}
          >
            Submit Review
          </button>
        </form>
      )}
    </section>
  );
}
