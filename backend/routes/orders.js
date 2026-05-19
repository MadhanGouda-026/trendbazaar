const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

// Place order
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, totalPrice } = req.body;
    const order = await Order.create({
      user: req.user._id, items, shippingAddress,
      paymentMethod, itemsPrice, totalPrice,
      shippingPrice: totalPrice > 499 ? 0 : 49,
    });
    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.orderStatus !== "placed") return res.status(400).json({ message: "Cannot cancel now" });
    order.orderStatus = "cancelled";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all orders
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update order status
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.orderStatus = req.body.status;
    if (req.body.status === "delivered") order.deliveredAt = Date.now();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
