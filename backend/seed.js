require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
require("dotenv").config();

const products = [
  { name: "iPhone 15 Pro Max", description: "Latest Apple flagship with A17 Pro chip, 48MP camera, titanium design.", price: 134900, originalPrice: 159900, category: "Electronics", subCategory: "Phones", brand: "Apple", images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"], stock: 15, isFeatured: true, isNew: true, discount: 16, tags: ["iphone", "apple", "smartphone"] },
  { name: "Samsung 4K OLED TV 55\"", description: "Stunning 4K OLED display with Dolby Vision, HDR10+, and smart features.", price: 89999, originalPrice: 119999, category: "Electronics", subCategory: "TVs", brand: "Samsung", images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"], stock: 8, isFeatured: true, discount: 25, tags: ["tv", "samsung", "4k"] },
  { name: "Sony WH-1000XM5 Headphones", description: "Industry-leading noise canceling with 30hr battery and multipoint connect.", price: 24990, originalPrice: 34990, category: "Electronics", subCategory: "Audio", brand: "Sony", images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400"], stock: 25, isFeatured: true, discount: 29, tags: ["headphones", "sony", "noise-cancel"] },
  { name: "Nike Air Max 270", description: "Iconic Air Max cushioning with breathable mesh upper for all-day comfort.", price: 12995, originalPrice: 15995, category: "Fashion", subCategory: "Shoes", brand: "Nike", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"], stock: 40, isFeatured: true, discount: 19, tags: ["nike", "shoes", "sneakers"] },
  { name: "Levi's 511 Slim Jeans", description: "Classic slim fit jeans in premium stretch denim for everyday style.", price: 2999, originalPrice: 4999, category: "Fashion", subCategory: "Clothing", brand: "Levi's", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"], stock: 60, discount: 40, tags: ["jeans", "levis", "fashion"] },
  { name: "MacBook Air M3", description: "Supercharged by M3 chip, 18hr battery, 13.6\" Liquid Retina display.", price: 114900, originalPrice: 124900, category: "Electronics", subCategory: "Laptops", brand: "Apple", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"], stock: 10, isFeatured: true, isNew: true, discount: 8, tags: ["macbook", "apple", "laptop"] },
  { name: "Instant Pot Duo 7-in-1", description: "Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, warmer.", price: 6999, originalPrice: 9999, category: "Home & Kitchen", subCategory: "Appliances", brand: "Instant Pot", images: ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"], stock: 30, discount: 30, tags: ["kitchen", "cooking", "appliance"] },
  { name: "The Alchemist - Paulo Coelho", description: "A magical story about following your dreams. International bestseller.", price: 299, originalPrice: 499, category: "Books", subCategory: "Fiction", brand: "HarperCollins", images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"], stock: 100, discount: 40, tags: ["book", "novel", "fiction"] },
  { name: "Yoga Mat Premium 6mm", description: "Non-slip, eco-friendly TPE yoga mat with alignment lines and carry strap.", price: 1299, originalPrice: 2499, category: "Sports", subCategory: "Yoga", brand: "Liforme", images: ["https://images.unsplash.com/photo-1601925228209-7e9e9d5a0ddf?w=400"], stock: 45, discount: 48, tags: ["yoga", "fitness", "mat"] },
  { name: "PS5 DualSense Controller", description: "Experience haptic feedback and adaptive triggers for immersive gaming.", price: 5990, originalPrice: 6990, category: "Gaming", subCategory: "Controllers", brand: "Sony", images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"], stock: 20, isFeatured: true, discount: 14, tags: ["ps5", "gaming", "controller"] },
  { name: "Boat Airdopes 141", description: "True wireless earbuds with 42hr total playback, ENx tech, instant voice assistant.", price: 1299, originalPrice: 4490, category: "Electronics", subCategory: "Audio", brand: "Boat", images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"], stock: 80, isNew: true, discount: 71, tags: ["earbuds", "wireless", "boat"] },
  { name: "Adidas Ultraboost 22", description: "Responsive Boost midsole with Primeknit+ upper for ultimate running comfort.", price: 16999, originalPrice: 21999, category: "Sports", subCategory: "Shoes", brand: "Adidas", images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400"], stock: 25, isFeatured: true, discount: 23, tags: ["adidas", "running", "shoes"] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    await User.create({ name: "Admin User", email: "admin@trendbazaar.com", password: "admin123", role: "admin" });
    await User.create({ name: "Test User", email: "user@trendbazaar.com", password: "user123" });
    console.log("✅ Users seeded");
    console.log("\n👤 Admin: admin@trendbazaar.com / admin123");
    console.log("👤 User:  user@trendbazaar.com / user123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
