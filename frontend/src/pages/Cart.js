// Cart.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

export default function Cart({ setPage }) {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart, user } = useAuth();

  if (cart.length === 0) return (
    <div className="empty-state" style={{ padding: "80px 20px" }}>
      <div className="empty-icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Add some products to get started</p>
      <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setPage({ name: "products" })}>Shop Now</button>
    </div>
  );

  const shipping = cartTotal > 499 ? 0 : 49;

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart ({cart.length} items)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.images?.[0]} alt={item.name} className="ci-img" onClick={() => setPage({ name: "product", id: item._id })} />
              <div className="ci-info">
                <div className="ci-name">{item.name}</div>
                <div className="ci-brand">{item.brand}</div>
                <div className="ci-price">₹{item.price.toLocaleString()}</div>
              </div>
              <div className="ci-actions">
                <div className="qty-ctrl">
                  <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                </div>
                <div className="ci-subtotal">₹{(item.price * item.qty).toLocaleString()}</div>
                <button className="ci-remove" onClick={() => removeFromCart(item._id)}>🗑️</button>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost" onClick={clearCart} style={{ marginTop: 8 }}>Clear Cart</button>
        </div>

        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Items ({cart.length})</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "FREE 🎉" : `₹${shipping}`}</span></div>
          {shipping === 0 && <div className="free-ship-msg">✅ You qualify for free shipping!</div>}
          <div className="summary-total"><span>Total</span><span>₹{(cartTotal + shipping).toLocaleString()}</span></div>
          <button className="btn btn-accent btn-lg" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => user ? setPage({ name: "checkout" }) : setPage({ name: "login" })}>
            {user ? "Proceed to Checkout →" : "Login to Checkout"}
          </button>
          <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => setPage({ name: "products" })}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
