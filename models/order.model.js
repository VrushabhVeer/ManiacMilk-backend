import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      size: String,
    },
  ],
  address: {
    fullName: String,
    email: String,
    mobile: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  paymentMethod: { type: String, enum: ["cod", "razorpay"], required: true },
  razorpayPaymentId: { type: String, default: null },
  razorpayOrderId: { type: String, default: null },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;
