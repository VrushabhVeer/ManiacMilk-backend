import { Router } from "express";
import ProductModel from "../models/product.model.js";

const productRouter = Router();

// Create a single product
productRouter.post("/create", async (req, res) => {
  try {
    const {
      name,
      frontImage,
      backImage,
      category,
      availability,
      tags,
      unit,
      description,
      sizes,
    } = req.body;

    const product = new ProductModel({
      name,
      frontImage,
      backImage,
      category,
      availability,
      tags,
      unit,
      description,
      sizes,
    });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// Create multiple products
productRouter.post("/allproducts", async (req, res) => {
  try {
    const { products } = req.body;
    const createdProducts = await ProductModel.insertMany(products);
    res
      .status(201)
      .json({ message: "Products created successfully", createdProducts });
  } catch (error) {
    console.error("Error creating multiple products:", error.message);
    res.status(500).json({ message: "Failed to create products" });
  }
});

// Get all products
productRouter.get("/allproducts", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Get a single product by ID
productRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Update a product by ID
productRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// Delete a product by ID
productRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default productRouter;
