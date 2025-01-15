import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import addressRouter from "./routes/address.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import orderRouter from "./routes/order.routes.js";
import cookieParser from "cookie-parser";
import databaseConnection from "./config/db.js";

dotenv.config();
const key = process.env.RAZORPAY_API_KEY;
const origin = process.env.CROSS_ORIGIN;
const port = process.env.PORT || 3001;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: origin, credentials: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

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

app.listen(port, async () => {
  try {
    await databaseConnection();
  } catch (error) {
    process.exit(1);
  }
  console.log(`server is running on ${port}`);
});

export default app;
