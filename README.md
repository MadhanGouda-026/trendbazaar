# 🛒 TrendBazaar — Full Stack Shopping App

React + Node.js + MongoDB shopping app with all features.

---

## 📁 Project Structure
```
trendbazaar/
├── backend/
│   ├── models/        ← User, Product, Order
│   ├── routes/        ← auth, products, orders
│   ├── middleware/    ← JWT auth
│   ├── server.js      ← Express server
│   ├── seed.js        ← Sample data
│   └── .env           ← Config (add MongoDB URL here)
└── frontend/
    ├── src/
    │   ├── context/   ← Auth + Cart state
    │   ├── components/← Navbar, ProductCard
    │   └── pages/     ← Home, Products, Cart, etc.
    └── package.json
```

---

## 🚀 SETUP COMMANDS (VS Code Terminal)

### STEP 1 — Open in VS Code
Unzip the folder, then open VS Code → File → Open Folder → select `trendbazaar`

### STEP 2 — Setup MongoDB Atlas (FREE)
1. Go to cloud.mongodb.com → Sign up free
2. Create cluster → M0 Free → Mumbai
3. Database Access → Add User → username + password
4. Network Access → Add IP → 0.0.0.0/0 (allow all)
5. Connect → Drivers → Copy connection string
6. Open `backend/.env` → Replace MONGO_URI with your string

### STEP 3 — Install Backend
Open Terminal 1 (`Ctrl + backtick`):
```
cd backend
npm install
```

### STEP 4 — Seed Sample Data
```
node seed.js
```
This adds 12 products + 2 users to MongoDB.

### STEP 5 — Start Backend
```
npm run dev
```
✅ Should show: `TrendBazaar API running on http://localhost:5000`
✅ Should show: `MongoDB Connected`

### STEP 6 — Install & Start Frontend
Open Terminal 2 (`Ctrl + Shift + backtick`):
```
cd frontend
npm install
npm start
```
✅ Browser opens at http://localhost:3000

---

## 👤 Demo Login Credentials
| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@trendbazaar.com | admin123 |
| User  | user@trendbazaar.com  | user123  |

---

## ✨ Features
- 🏠 Home with animated banner & featured products
- 🔍 Search & filter by category, price, rating
- 🛒 Cart with quantity control
- ❤️ Wishlist (login required)
- 👤 User auth (JWT)
- 📦 Order placement & tracking
- ⭐ Product reviews & ratings
- 💳 Checkout with address form
- 📱 Responsive design

## 🛠️ Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| Styling | Custom CSS |
