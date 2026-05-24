import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

const API = process.env.REACT_APP_API_URL || "";

export default function ProductDetail({ id, setPage }) {
  const { addToCart, user, headers, showToast } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .catch(() => {});
  }, [id]);

  const submitReview = async () => {
    if (!user) return showToast("Login to review", "error");
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/products/${id}/review`, { method: "POST", headers, body: JSON.stringify(review) });
      const data = await res.json();
      if (!res.ok) return showToast(data.message, "error");
      showToast("Review submitted! ⭐");
      const updated = await fetch(`${API}/api/products/${id}`).then(r => r.json());
      setProduct(updated);
    } catch { showToast("Error", "error"); }
    finally { setSubmitting(false); }
  };

  if (!product) return <div className="page-loading"><div className="spinner" /></div>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="pd-page">
      <button className="btn btn-ghost btn-sm pd-back" onClick={() => setPage({ name: "products" })}>← Back</button>
      <div className="pd-layout">
        <div className="pd-image-section">
          <img src={product.images?.[0] || "https://images.unsplash.com/photo-1560472355-536de3962603?w=600"} alt={product.name} className="pd-main-img" />
        </div>
        <div className="pd-info">
          <div className="pd-brand">{product.brand}</div>
          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-rating-row">
            {Array.from({ length: 5 }, (_, i) => <span key={i} className={`star ${i < Math.round(product.ratings) ? "" : "empty"}`}>★</span>)}
            <span className="pd-rating-val">{product.ratings?.toFixed(1) || "0.0"}</span>
            <span className="pd-review-count">({product.numReviews} reviews)</span>
          </div>
          <div className="pd-price-section">
            <span className="pd-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <>
              <span className="pd-original">₹{product.originalPrice.toLocaleString()}</span>
              <span className="badge badge-red">{discount}% OFF</span>
            </>}
          </div>
          <p className="pd-desc">{product.description}</p>
          <div className="pd-stock">
            {product.stock > 0 ? <span className="in-stock">✅ In Stock ({product.stock} left)</span> : <span className="out-stock">❌ Out of Stock</span>}
          </div>
          <div className="pd-qty-row">
            <span className="pd-qty-label">Quantity:</span>
            <div className="qty-ctrl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>
          <div className="pd-btns">
            <button className="btn btn-primary btn-lg" onClick={() => { addToCart(product, qty); }} disabled={product.stock === 0}>🛒 Add to Cart</button>
            <button className="btn btn-accent btn-lg" onClick={() => { addToCart(product, qty); setPage({ name: "cart" }); }} disabled={product.stock === 0}>⚡ Buy Now</button>
          </div>
          <div className="pd-tags">
            {product.tags?.map(t => <span key={t} className="pd-tag">#{t}</span>)}
          </div>
        </div>
      </div>
      <div className="pd-reviews">
        <h2>Customer Reviews</h2>
        {product.reviews?.length === 0 && <p style={{ color: "var(--ink-mute)" }}>No reviews yet. Be the first!</p>}
        <div className="reviews-list">
          {product.reviews?.map((r, i) => (
            <div key={i} className="review-item">
              <div className="review-header">
                <span className="review-name">{r.name}</span>
                <div className="stars">{Array.from({ length: 5 }, (_, j) => <span key={j} className={`star ${j < r.rating ? "" : "empty"}`}>★</span>)}</div>
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
        {user && (
          <div className="review-form card">
            <h4>Write a Review</h4>
            <div className="rating-select">
              {[1,2,3,4,5].map(n => <button key={n} className={`rating-star ${review.rating >= n ? "active" : ""}`} onClick={() => setReview(r => ({ ...r, rating: n }))}>★</button>)}
            </div>
            <textarea className="input" rows={3} placeholder="Share your experience..." value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} style={{ marginTop: 12 }} />
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={submitReview} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
