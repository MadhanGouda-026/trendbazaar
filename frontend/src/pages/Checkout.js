import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

export default function Checkout({ setPage }) {
  const { cart, cartTotal, clearCart, headers, showToast } = useAuth();
  const [addr, setAddr] = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal > 499 ? 0 : 49;
  const total = cartTotal + shipping;

  const placeOrder = async () => {
    if (!addr.name || !addr.phone || !addr.street || !addr.city || !addr.state || !addr.pincode)
      return showToast("Fill all address fields", "error");
    setLoading(true);
    try {
      const res = await fetch((process.env.REACT_APP_API_URL||"")+"/api/orders", {
        method: "POST", headers,
        body: JSON.stringify({
          items: cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.price, quantity: i.qty })),
          shippingAddress: addr, paymentMethod: payment,
          itemsPrice: cartTotal, totalPrice: total,
        }),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message, "error");
      clearCart();
      showToast("Order placed successfully! 🎉");
      setPage({ name: "orders" });
    } catch { showToast("Error placing order", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-form card">
          <h3>Delivery Address</h3>
          <div className="form-grid">
            {[["name","Full Name"],["phone","Phone Number"],["street","Street Address"],["city","City"],["state","State"],["pincode","Pincode"]].map(([k,ph]) => (
              <input key={k} className={`input ${k === "street" ? "full-width" : ""}`} placeholder={ph} value={addr[k]} onChange={e => setAddr(a => ({ ...a, [k]: e.target.value }))} />
            ))}
          </div>

          <h3 style={{ marginTop: 24 }}>Payment Method</h3>
          <div className="pay-options">
            {["COD", "UPI", "Card"].map(p => (
              <label key={p} className={`pay-option ${payment === p ? "active" : ""}`}>
                <input type="radio" value={p} checked={payment === p} onChange={() => setPayment(p)} />
                {p === "COD" ? "💵 Cash on Delivery" : p === "UPI" ? "📱 UPI Payment" : "💳 Credit/Debit Card"}
              </label>
            ))}
          </div>
          {payment !== "COD" && <div className="pay-note">⚠️ Demo mode: only COD processes orders</div>}
        </div>

        <div className="checkout-summary card">
          <h3>Order Summary</h3>
          {cart.map(i => (
            <div key={i._id} className="cs-item">
              <img src={i.images?.[0]} alt={i.name} />
              <div className="cs-name">{i.name} × {i.qty}</div>
              <div className="cs-price">₹{(i.price * i.qty).toLocaleString()}</div>
            </div>
          ))}
          <div className="cs-row"><span>Items</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
          <div className="cs-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button className="btn btn-accent btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={placeOrder} disabled={loading}>
            {loading ? "Placing Order..." : "Place Order →"}
          </button>
        </div>
      </div>
    </div>
  );
}
