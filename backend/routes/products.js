const router = require("express").Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

// Get all products with filters
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    let query = {};
    if (category && category !== "all") query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) query.price = { $gte: minPrice || 0, $lte: maxPrice || 999999 };

    let sortObj = {};
    if (sort === "price_asc") sortObj = { price: 1 };
    else if (sort === "price_desc") sortObj = { price: -1 };
    else if (sort === "rating") sortObj = { ratings: -1 };
    else if (sort === "newest") sortObj = { createdAt: -1 };
    else sortObj = { isFeatured: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj)
      .skip((page - 1) * limit).limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Featured products
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get categories
router.get("/categories", async (req, res) => {
  try {
    const cats = await Product.distinct("category");
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review
router.post("/:id/review", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: "Already reviewed" });
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: req.body.rating, comment: req.body.comment });
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create product
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update product
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete product
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
