import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import addressRouter from "./routes/address.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import orderRouter from "./routes/order.routes.js";

dotenv.config();
const key = process.env.RAZORPAY_API_KEY;

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/", (_, res) => {
  res.send("Welcome to maniac");
});
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/address", addressRouter);
app.use("/payment", paymentRouter);
app.use("/getKey", (_, res) => {
  res.status(200).json({ key: key });
});

app.use("/orders", orderRouter);

export default app;