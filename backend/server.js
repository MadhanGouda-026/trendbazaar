require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

app.get("/api/health", (req, res) => res.json({ status: "OK", message: "TrendBazaar API Running 🛒" }));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`\n🛒 TrendBazaar API running on http://localhost:${PORT}`);
      console.log(`📡 Endpoints: /api/auth  /api/products  /api/orders\n`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Error:", err.message));
