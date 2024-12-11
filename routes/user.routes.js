import UserModel from "../models/user.model.js";
import { Router } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import auth from "../middlewares/authentication.js";

dotenv.config();

const senderEmail = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const key = process.env.SECRETKEY;
const otpStore = {};

const userRouter = Router();

const loadEmailTemplate = (otp) => {
  const templatePath = path.join(process.cwd(), "emails", "emailTemplate.html");

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Email template not found at path: ${templatePath}`);
  }

  let template = fs.readFileSync(templatePath, "utf-8");
  template = template.replace("{{otp}}", otp); // Replace the {{otp}} placeholder with the actual OTP
  return template;
};

// Route to send OTP
userRouter.post("/send_otp", (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate OTP and set expiry time
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = { otp, expires: Date.now() + 15 * 60 * 1000 }; // Valid for 15 minutes

  // Set up nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: pass,
    },
  });

  try {
    const htmlContent = loadEmailTemplate(otp); // Get the email HTML template with OTP

    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: "Your Login Code",
      html: htmlContent,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP." });
      }

      console.log(`Generated OTP for ${email}: ${otp}`);
      res.status(200).json({ message: "OTP sent successfully." });
    });
  } catch (error) {
    console.error("Error loading email template:", error);
    res.status(500).json({ message: "Failed to load email template." });
  }
});

// Route to verify OTP
userRouter.post("/otp_verification", (req, res) => {
  const { email, otp } = req.body;

  // Validate email and OTP
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  // Check if OTP exists and is valid
  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res
      .status(400)
      .json({ message: "No OTP request found for this email." });
  }

  if (storedOtpData.expires < Date.now()) {
    delete otpStore[email]; // Clean up expired OTP
    return res.status(400).json({ message: "OTP expired." });
  }

  if (storedOtpData.otp === otp) {
    delete otpStore[email];

    const token = jwt.sign({ email }, key, { expiresIn: "1h" });

    return res
      .status(200)
      .json({ message: "OTP verified successfully.", token: token });
  } else {
    return res.status(400).json({ message: "Invalid OTP." });
  }
});

userRouter.post("/create", async (req, res) => {
  const { fullname, email, mobile } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({ fullname, email, mobile });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("User creation/login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

userRouter.get("/profile", auth, async (req, res) => {
  try {
    const email = req.user.email;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

userRouter.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
});

export default userRouter;
