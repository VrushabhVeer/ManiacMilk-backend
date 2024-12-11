import { Router } from "express";
import AddressModel from "../models/address.model.js";

const addressRouter = Router();

// Add a new address
addressRouter.post("/create", async (req, res) => {
  try {
    const {
      fullname,
      mobile,
      email,
      house,
      area,
      city,
      pincode,
      state,
      userId,
    } = req.body;

    const newAddress = new AddressModel({
      fullname,
      mobile,
      email,
      house,
      area,
      city,
      pincode,
      state,
      userId,
    });

    // Save to database
    await newAddress.save();

    res
      .status(201)
      .json({ message: "Address added successfully.", address: newAddress });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while saving the address.", error });
  }
});

// get address by id

export default addressRouter;
