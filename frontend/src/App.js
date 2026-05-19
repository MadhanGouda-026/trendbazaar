import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import { Login, Register } from "./pages/Auth";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import "./index.css";

function AppContent() {
  const [page, setPage] = useState({ name: "home" });

  const renderPage = () => {
    switch (page.name) {
      case "home":     return <Home setPage={setPage} />;
      case "products": return <Products setPage={setPage} initCategory={page.category} initSearch={page.search} />;
      case "product":  return <ProductDetail id={page.id} setPage={setPage} />;
      case "cart":     return <Cart setPage={setPage} />;
      case "login":    return <Login setPage={setPage} />;
      case "register": return <Register setPage={setPage} />;
      case "orders":   return <Orders setPage={setPage} />;
      case "checkout": return <Checkout setPage={setPage} />;
      default:         return <Home setPage={setPage} />;
    }
  };

  return (
    <div>
      <Navbar page={page.name} setPage={setPage} />
      <main>{renderPage()}</main>
      <footer style={{ background: "var(--ink)", color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "24px", fontSize: "13px", marginTop: "40px" }}>
        © 2024 TrendBazaar — Shop Everything You Love
      </footer>
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
