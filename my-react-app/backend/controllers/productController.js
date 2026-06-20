import Product from "../models/product.js";
import { redisClient } from "../config/redis.js";

const PRODUCTS_CACHE_KEY = "products";

const getProducts = async (req, res) => {
  try {
    if (redisClient.isReady) {
      const cachedProducts = await redisClient.get(PRODUCTS_CACHE_KEY);
      if (cachedProducts) {
        console.log("redis hit");
        return res.status(200).json(JSON.parse(cachedProducts));
      }
    }

    const products = await Product.find();

    if (redisClient.isReady) {
      await redisClient.set(PRODUCTS_CACHE_KEY, JSON.stringify(products), {
        EX: 300
      });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, company, expiry, description, stock } = req.body;

    if (!name || !price || !company || !expiry) {
      return res.status(400).json({
        message: "name, price, company, and expiry are required"
      });
    }

    const product = await Product.create({
      name,
      price,
      company,
      expiry,
      description,
      stock
    });

    if (redisClient.isReady) {
      await redisClient.del(PRODUCTS_CACHE_KEY);
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (redisClient.isReady) {
      await redisClient.del(PRODUCTS_CACHE_KEY);
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (redisClient.isReady) {
      await redisClient.del(PRODUCTS_CACHE_KEY);
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
