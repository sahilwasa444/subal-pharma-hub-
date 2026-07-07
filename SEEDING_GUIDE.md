# 🚀 Bulk Product Seeding Guide

## Quick Start - Add 100 Products Instantly

Your seeding script is ready at: `backend/seedProducts.js`

### Option 1: Run with Node (Fastest)

```bash
# Navigate to backend folder
cd my-react-app/backend

# Run the seeding script
node seedProducts.js
```

### Option 2: Add as NPM Script

Edit `my-react-app/package.json` and add:

```json
{
  "scripts": {
    "seed": "node backend/seedProducts.js"
  }
}
```

Then run:
```bash
npm run seed
```

---

## What Gets Added

✅ **100 Pharmaceutical Products** including:
- Pain relievers (Dolo, Crocin, Ibuprofen, etc.)
- Antibiotics (Amoxicillin, Azithromycin, Ciprofloxacin, etc.)
- Cough & Cold remedies
- Digestive aids
- Vitamins & Supplements
- Diabetes medications
- Blood pressure medications
- Heart health medications
- Plus variations (250mg, Extra Strength, Generic, Premium versions)

Each product includes:
- **Name**
- **Price** (₹40 - ₹850)
- **Company** (GSK, Cipla, Ranbaxy, etc.)
- **Stock** (50 - 600 units)
- **Description**
- **Expiry Date** (6-24 months from now - auto-generated)

---

## Example Output

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB
📊 Existing products: 0
📝 Adding 100 products to database...
✅ Successfully added 100 products!
📊 Total products in database: 100

📦 Sample products added:
  1. Dolo 650 - ₹45 (Micro Labs)
  2. Crocin 500 - ₹50 (GSK)
  3. Ibuprofen 200mg - ₹60 (Cipla)
  4. Aspirin 500 - ₹65 (Bayer)
  5. Combiflam - ₹85 (Sanofi)
  ... and 95 more!

🔌 Database connection closed
```

---

## Notes

- ✅ Script automatically connects to MongoDB using `.env` settings
- ✅ Generates random expiry dates (6-24 months)
- ✅ Products are ready to use immediately in your app
- ✅ Redis cache will be cleared on first product fetch
- ⚠️ If you want to **remove old products first**, uncomment this line in `seedProducts.js`:
  ```javascript
  // await Product.deleteMany({});
  ```

---

## Verify in Your App

1. Run the seed script
2. Start your server: `npm start`
3. Go to your app and check the Products page
4. You should see all 100 products with prices, stock, and details!

---

**Done! 🎉 No more manual adding products one by one!**
