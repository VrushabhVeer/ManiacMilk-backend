import { Router } from "express";
import CartModel from "../models/cart.model.js";

const cartRouter = Router();

// Add or update an item in the cart
cartRouter.post("/add", async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !items.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await CartModel.findOne({ userId });

    if (cart) {
      items.forEach((item) => {
        const itemIndex = cart.items.findIndex(
          (cartItem) =>
            cartItem.productId === item.productId &&
            cartItem.selectedSize._id === item.selectedSize._id
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      });

      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = new CartModel({
        userId,
        items,
      });
      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Get the cart items:
cartRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const cart = await CartModel.findOne({ userId });

    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Edit an item in the cart
cartRouter.put("/edit", async (req, res) => {
  try {
    const { userId, productId, selectedSize, quantity } = req.body;

    if (!userId || !productId || !selectedSize) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await CartModel.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.selectedSize._id === selectedSize._id
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Clear all items in the cart
cartRouter.post("/clear", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const cart = await CartModel.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Merge guest cart into user cart
cartRouter.post("/merge", async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await CartModel.findOne({ userId });

    if (cart) {
      items.forEach((guestItem) => {
        const itemIndex = cart.items.findIndex(
          (item) =>
            item.productId === guestItem.productId &&
            item.selectedSize._id === guestItem.selectedSize._id
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += guestItem.quantity; // Merge quantities
        } else {
          cart.items.push(guestItem); // Add new item
        }
      });

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create a new cart
      const newCart = new CartModel({
        userId,
        items,
      });
      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Error merging cart:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

export default cartRouter;
