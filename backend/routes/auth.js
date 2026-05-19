const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, token: genToken(updated._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Wishlist toggle
router.post("/wishlist/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const idx = user.wishlist.indexOf(pid);
    if (idx === -1) user.wishlist.push(pid);
    else user.wishlist.splice(idx, 1);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
