import mongoose from "mongoose";
import Product from "./models/product.js";
import dotenv from "dotenv";

dotenv.config();

const testSeed = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/pharmahub";
    console.log("Connecting to:", mongoUrl);
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected");

    const beforeCount = await Product.countDocuments();
    console.log("Before:", beforeCount);

    // Insert 5 test products
    const testProducts = [
      { name: "Test Product 1", price: 100, company: "Test Co", expiry: "2025-12-31", stock: 50 },
      { name: "Test Product 2", price: 200, company: "Test Co", expiry: "2025-12-31", stock: 50 },
      { name: "Test Product 3", price: 300, company: "Test Co", expiry: "2025-12-31", stock: 50 },
      { name: "Test Product 4", price: 400, company: "Test Co", expiry: "2025-12-31", stock: 50 },
      { name: "Test Product 5", price: 500, company: "Test Co", expiry: "2025-12-31", stock: 50 },
    ];

    const inserted = await Product.insertMany(testProducts);
    console.log("Inserted:", inserted.length);

    const afterCount = await Product.countDocuments();
    console.log("After:", afterCount);

    // Check what's in the database
    const allProducts = await Product.find().limit(10);
    console.log("\nFirst 10 products:");
    allProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${p.price}`);
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

testSeed();
