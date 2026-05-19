import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar({ page, setPage }) {
  const { user, logout, cartCount } = useAuth();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { setPage({ name: "products", search }); setSearch(""); }
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <button className="nav-brand" onClick={() => setPage({ name: "home" })}>
          <span className="brand-t">Trend</span><span className="brand-b">Bazaar</span>
        </button>

        {/* Search */}
        <form className="nav-search" onSubmit={handleSearch}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands, categories..." className="nav-search-input" />
          <button type="submit" className="nav-search-btn">🔍</button>
        </form>

        {/* Actions */}
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setPage({ name: "products" })}>Shop</button>

          {user ? (
            <>
              <button className="nav-btn" onClick={() => setPage({ name: "orders" })}>Orders</button>
              <button className="nav-icon-btn" onClick={() => setPage({ name: "wishlist" })}>❤️</button>
              <button className="nav-btn nav-user" onClick={() => setPage({ name: "profile" })}>
                <span className="nav-avatar">{user.name[0]}</span>
                {user.name.split(" ")[0]}
              </button>
              <button className="nav-btn btn-ghost nav-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-btn" onClick={() => setPage({ name: "login" })}>Login</button>
              <button className="btn btn-primary btn-sm" onClick={() => setPage({ name: "register" })}>Sign Up</button>
            </>
          )}

          <button className="nav-cart-btn" onClick={() => setPage({ name: "cart" })}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Category bar */}
      <div className="nav-cats">
        {["Electronics", "Fashion", "Home & Kitchen", "Sports", "Books", "Gaming"].map(c => (
          <button key={c} className="nav-cat" onClick={() => setPage({ name: "products", category: c })}>{c}</button>
        ))}
      </div>
    </nav>
  );
}
