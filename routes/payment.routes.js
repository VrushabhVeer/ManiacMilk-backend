import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import PaymentModel from "../models/payment.model.js";

dotenv.config();

const key_id = process.env.RAZORPAY_API_KEY;
const key_secret = process.env.RAZORPAY_SECRETE_KEY;

export const instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

const paymentRouter = Router();

paymentRouter.post("/checkout", async (req, res) => {
  try {
    var options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

paymentRouter.post("/paymentverification", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthenticate = expectedSignature === razorpay_signature;

    if (isAuthenticate) {
      await PaymentModel.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.status(200).json({
        success: true,
        redirectUrl: `http://localhost:5173/placed?reference=${razorpay_payment_id}&orderId=${razorpay_order_id}`,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error in paymentverification:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default paymentRouter;
