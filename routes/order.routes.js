import { Router } from "express";
import OrderModel from "../models/order.model.js";
import auth from "../middlewares/authentication.js";

const orderRouter = Router();

// Place a new order
orderRouter.post("/place", async (req, res) => {
  const {
    userId,
    cartItems,
    address,
    paymentMethod,
    razorpayPaymentId,
    razorpayOrderId,
    subtotal,
    shipping,
    total,
  } = req.body;

  try {
    const order = new OrderModel({
      userId,
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

// Get all orders
orderRouter.get("/allorders", auth, async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }); // Sort by latest orders
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get a specific order by ID
orderRouter.get("/order/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, orders: [order] }); // Return as an array
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get a order by user ID
orderRouter.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await OrderModel.find({ userId });
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, orders }); // Return as an array
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// cancel order by orderId
orderRouter.put("/cancel/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Order is already cancelled" });
    }

    // Update the order status to "Cancelled"
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
});

export default orderRouter;
