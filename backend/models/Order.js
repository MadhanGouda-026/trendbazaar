const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String, image: String, price: Number, quantity: Number,
  }],
  shippingAddress: {
    name: String, phone: String, street: String,
    city: String, state: String, pincode: String,
  },
  paymentMethod: { type: String, default: "COD" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  orderStatus: {
    type: String,
    enum: ["placed", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"],
    default: "placed",
  },
  itemsPrice: Number,
  shippingPrice: { type: Number, default: 0 },
  totalPrice: Number,
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
