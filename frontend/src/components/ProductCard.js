import React from "react";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

export default function ProductCard({ product, onClick }) {
  const { addToCart, user, wishlist, setWishlist, headers, showToast } = useAuth();
  const isWished = wishlist.includes(product._id);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return showToast("Login to add wishlist ❤️", "error");
    try {
      const res = await fetch(`/api/auth/wishlist/${product._id}`, { method: "POST", headers });
      const data = await res.json();
      setWishlist(data.wishlist);
      showToast(isWished ? "Removed from wishlist" : "Added to wishlist ❤️");
    } catch { showToast("Error", "error"); }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.ratings || 0));

  return (
    <div className="product-card" onClick={() => onClick(product._id)}>
      <div className="pc-image-wrap">
        <img src={product.images?.[0] || "https://images.unsplash.com/photo-1560472355-536de3962603?w=400"} alt={product.name} className="pc-image" />
        {product.discount > 0 && <span className="pc-discount">-{product.discount}%</span>}
        {product.isNew && <span className="pc-new">NEW</span>}
        <button className={`pc-wish ${isWished ? "wished" : ""}`} onClick={toggleWishlist}>
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="pc-body">
        <div className="pc-brand">{product.brand}</div>
        <div className="pc-name">{product.name}</div>

        <div className="pc-stars">
          {stars.map((f, i) => <span key={i} className={`star ${f ? "" : "empty"}`}>★</span>)}
          <span className="pc-reviews">({product.numReviews || 0})</span>
        </div>

        <div className="pc-price-row">
          <span className="pc-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && <span className="pc-original">₹{product.originalPrice.toLocaleString()}</span>}
        </div>

        <button className="pc-cart-btn" onClick={e => { e.stopPropagation(); addToCart(product); }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
