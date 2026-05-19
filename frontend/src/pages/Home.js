import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const BANNERS = [
  { title: "New Season\nArrivals", sub: "Up to 50% OFF on Fashion", bg: "linear-gradient(135deg,#0a0a0f 60%,#2d1a4a)", accent: "#7c3aed", cat: "Fashion" },
  { title: "Tech Deals\nLive Now", sub: "Best prices on Electronics", bg: "linear-gradient(135deg,#1a0a0a 60%,#4a1a0a)", accent: "#ff4d00", cat: "Electronics" },
  { title: "Sport &\nFitness", sub: "Premium brands, huge savings", bg: "linear-gradient(135deg,#0a1a0f 60%,#0a3a1a)", accent: "#10b981", cat: "Sports" },
];

export default function Home({ setPage }) {
  const [featured, setFeatured] = useState([]);
  const [banner, setBanner] = useState(0);

  useEffect(() => {
    fetch("/api/products/featured")
      .then(r => r.json())
      .then(setFeatured)
      .catch(() => {});
    const t = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[banner];

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero" style={{ background: b.bg }}>
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-tag" style={{ background: b.accent }}>🔥 Hot Deals</span>
            <h1 className="hero-title">{b.title}</h1>
            <p className="hero-sub">{b.sub}</p>
            <div className="hero-btns">
              <button className="btn btn-accent btn-lg" onClick={() => setPage({ name: "products", category: b.cat })}>
                Shop Now →
              </button>
              <button className="btn btn-outline btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }} onClick={() => setPage({ name: "products" })}>
                All Products
              </button>
            </div>
          </div>
          <div className="hero-dots">
            {BANNERS.map((_, i) => <button key={i} className={`hero-dot ${i === banner ? "active" : ""}`} onClick={() => setBanner(i)} />)}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="home-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="cats-grid">
          {[
            { name: "Electronics", icon: "📱", color: "#dbeafe" },
            { name: "Fashion", icon: "👗", color: "#fce7f3" },
            { name: "Home & Kitchen", icon: "🏠", color: "#d1fae5" },
            { name: "Sports", icon: "⚽", color: "#fef3c7" },
            { name: "Books", icon: "📚", color: "#ede9fe" },
            { name: "Gaming", icon: "🎮", color: "#fee2e2" },
          ].map(c => (
            <button key={c.name} className="cat-card" style={{ background: c.color }} onClick={() => setPage({ name: "products", category: c.name })}>
              <span className="cat-icon">{c.icon}</span>
              <span className="cat-name">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="home-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setPage({ name: "products" })}>View All</button>
        </div>
        {featured.length === 0 ? (
          <div className="page-loading"><div className="spinner" /></div>
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} onClick={(id) => setPage({ name: "product", id })} />)}
          </div>
        )}
      </div>

      {/* Features strip */}
      <div className="features-strip">
        {[
          { icon: "🚚", title: "Free Delivery", sub: "On orders above ₹499" },
          { icon: "🔄", title: "Easy Returns", sub: "10-day return policy" },
          { icon: "🔒", title: "Secure Payments", sub: "100% safe & encrypted" },
          { icon: "⚡", title: "Fast Shipping", sub: "2-4 business days" },
        ].map(f => (
          <div key={f.title} className="feature-item">
            <span className="feature-icon">{f.icon}</span>
            <div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-sub">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
