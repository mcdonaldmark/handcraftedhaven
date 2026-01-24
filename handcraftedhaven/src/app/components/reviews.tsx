"use client";

import { useState } from "react";

interface Review {
  id: number;
  rating: number;
  comment: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, rating: 5, comment: "Absolutely beautiful craftsmanship!" },
    { id: 2, rating: 4, comment: "Great quality, would buy again." },
  ]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!comment.trim()) return;

    const newReview: Review = {
      id: Date.now(),
      rating,
      comment,
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setRating(5);
  }

  return (
    <section className="section">
      <h3>Customer Reviews</h3>

      {/* Average Rating */}
      <div className="feature-card" style={{ marginBottom: "1.5rem" }}>
        <strong>Average Rating:</strong> {averageRating.toFixed(1)} ⭐ (
        {reviews.length} reviews)
      </div>

      {/* Reviews List */}
      <div className="features">
        {reviews.map((review) => (
          <div key={review.id} className="feature-card">
            <p>
              {"⭐".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Review Form */}
      <h3>Leave a Review</h3>

      <form onSubmit={handleSubmit} className="feature-card">
        <label>
          Rating
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "block", marginTop: "1rem" }}>
          Comment
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", marginTop: "0.5rem" }}
            placeholder="Share your experience..."
          />
        </label>

        <button className="cta" type="submit" style={{ marginTop: "1rem" }}>
          Submit Review
        </button>
      </form>
    </section>
  );
}
