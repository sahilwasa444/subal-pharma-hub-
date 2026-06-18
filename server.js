const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Debugging Middleware: See every request in your terminal
app.use((req, res, next) => {
  console.log(`${req.method} request received for: ${req.url}`);
  next();
});

// 0. Root Route (Fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Pharmahub Backend is running perfectly!");
});

// 1. Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/pharmahub")
  .then(() => console.log("Connected to MongoDB (pharmahub)"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// 2. Define Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  company: String,
  expiry: String,
  description: String,
  stock: Number
});

const Product = mongoose.model("Product", productSchema);

// 3. API Routes

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new product
app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});