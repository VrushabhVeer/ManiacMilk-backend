import { Router } from "express";
import OrderModel from "../models/order.model.js";

const orderRouter = Router();

// Place a new order
orderRouter.post("/place", async (req, res) => {
  try {
    const {
      cartItems,
      address,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
      subtotal,
      shipping,
      total,
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!address || !paymentMethod || !subtotal || !shipping || !total) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete order details" });
    }

    // Create a new order
    const order = new OrderModel({
      cartItems,
      address,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
      subtotal,
      shipping,
      total,
    });

    const savedOrder = await order.save();
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get a specific order by ID (for Placed.jsx page or admin)
orderRouter.get("/:orderId", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all orders
orderRouter.get("/allorders", async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }); // Sort by latest orders
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default orderRouter;
