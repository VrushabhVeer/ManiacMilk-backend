import { Router } from "express";
import AddressModel from "../models/address.model.js";

const addressRouter = Router();

// Add a new address
addressRouter.post("/create", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
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
      firstname,
      lastname,
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

// Get address by user ID
addressRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const address = await AddressModel.findOne({ userId });

    // If no address exists, optionally create a default address
    if (!address) {
      address = new AddressModel({
        firstname: "Default",
        lastname: "User",
        mobile: "0000000000",
        email: `${userId}@example.com`,
        house: "N/A",
        area: "N/A",
        city: "N/A",
        pincode: "000000",
        state: "N/A",
        userId,
      });

      // Save the default address
      await address.save();

      return res
        .status(201)
        .json({ message: "Default address created.", address });
    }

    res.status(200).json(address);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while retrieving the address.",
        error,
      });
  }
});

// Edit (update) an address by ID
addressRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation runs on update
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.status(200).json({
      message: "Address updated successfully.",
      address: updatedAddress,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while updating the address.",
        error,
      });
  }
});

// Delete an address by ID
addressRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await AddressModel.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.status(200).json({ message: "Address deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the address.",
        error,
      });
  }
});

export default addressRouter;
