import { Router } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

dotenv.config();

const saltRound = Number(process.env.SALTROUND);
const key = process.env.SECRETKEY;

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email address already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = new UserModel({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successfully." });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidpassword = await bcrypt.compare(password, findUser.password);

    if (!isValidpassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: findUser._id, userName: findUser.fullname },
      key,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful",
      token,
      userName: findUser.fullname,
      userId: findUser._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

export default userRouter;
