import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const SORTS = [
  { value: "", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function Products({ setPage, initCategory, initSearch }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initCategory || "");
  const [search, setSearch] = useState(initSearch || "");
  const [sort, setSort] = useState("");
  const [page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { setCategory(initCategory || ""); setSearch(initSearch || ""); setCurrentPage(1); }, [initCategory, initSearch]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    fetch(`${process.env.REACT_APP_API_URL||""}/api/products?${params}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setTotalPages(d.pages || 1); setTotal(d.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, search, sort, page]);

  const cats = ["", "Electronics", "Fashion", "Home & Kitchen", "Sports", "Books", "Gaming"];

  return (
    <div className="products-page">
      <div className="products-inner">
        {/* Sidebar */}
        <aside className="prod-sidebar">
          <div className="sidebar-section">
            <h4>Categories</h4>
            {cats.map(c => (
              <button key={c} className={`sidebar-cat ${category === c ? "active" : ""}`} onClick={() => { setCategory(c); setCurrentPage(1); }}>
                {c || "All Products"}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="prod-main">
          {/* Toolbar */}
          <div className="prod-toolbar">
            <div className="prod-count">
              {loading ? "Loading..." : `${total} products found`}
              {(category || search) && <span className="active-filter">{category || search} ✕</span>}
            </div>
            <select className="input sort-select" value={sort} onChange={e => { setSort(e.target.value); setCurrentPage(1); }}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="products-grid-page">
              {products.map(p => <ProductCard key={p._id} product={p} onClick={id => setPage({ name: "product", id })} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
