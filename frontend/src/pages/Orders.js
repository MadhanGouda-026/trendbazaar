import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

const STATUS_COLOR = { placed: "badge-orange", confirmed: "badge-purple", shipped: "badge-purple", out_for_delivery: "badge-purple", delivered: "badge-green", cancelled: "badge-red" };

export default function Orders({ setPage }) {
  const { headers } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL||"")+"/api/orders/my", { headers })
      .then(r => r.json())
      .then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  if (orders.length === 0) return (
    <div className="empty-state" style={{ padding: "80px 20px" }}>
      <div className="empty-icon">📦</div>
      <h3>No orders yet</h3>
      <p>Start shopping to see your orders here</p>
      <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setPage({ name: "products" })}>Shop Now</button>
    </div>
  );

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(o => (
          <div key={o._id} className="order-card card">
            <div className="order-header">
              <div>
                <div className="order-id">Order #{o._id.slice(-8).toUpperCase()}</div>
                <div className="order-date">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <span className={`badge ${STATUS_COLOR[o.orderStatus]}`}>{o.orderStatus.replace(/_/g, " ").toUpperCase()}</span>
            </div>
            <div className="order-items">
              {o.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <div className="oi-name">{item.name}</div>
                    <div className="oi-meta">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                  </div>
                  <div className="oi-total">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span className="order-total">Total: ₹{o.totalPrice.toLocaleString()}</span>
              <span className="order-pay">{o.paymentMethod} · {o.paymentStatus}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
