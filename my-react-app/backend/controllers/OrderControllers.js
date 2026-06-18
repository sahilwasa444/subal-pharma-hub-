import Order from "../models/Order.js";

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }
    if (!totalPrice || typeof totalPrice !== "number") {
      return res.status(400).json({ message: "Total price must be a number" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      status: "Pending",
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export { createOrder, getOrders };
