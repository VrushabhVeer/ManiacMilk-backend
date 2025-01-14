import { Router } from "express";
import ProductModel from "../models/product.model.js";
import upload from "../middlewares/multerMiddleware.js";
const productRouter = Router();

// Create a single product
productRouter.post(
  "/create",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        category,
        availability,
        tags,
        unit,
        description,
        sizes,
        price,
      } = req.body;

      console.log("Request Body:", req.body);
      console.log("Uploaded Files:", req.files);

      const parsedSizes = sizes ? JSON.parse(sizes) : [];

      const frontImagePath = req.files?.frontImage?.[0]?.path || null;
      const backImagePath = req.files?.backImage?.[0]?.path || null;

      if (!name || !category || !unit || !description || !price) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      const product = new ProductModel({
        name,
        frontImage: frontImagePath ? `/${frontImagePath}` : null,
        backImage: backImagePath ? `/${backImagePath}` : null,
        category,
        availability,
        tags,
        unit,
        description,
        price,
        sizes: parsedSizes.filter(
          (s, index, self) => index === self.findIndex((t) => t.size === s.size)
        ),
      });

      await product.save();

      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      console.error("Error creating product:", error.message);
      res.status(500).json({ message: "Failed to create product" });
    }
  }
);

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

// Update a product with optional image uploads
productRouter.put(
  "/:id",
  upload.fields([{ name: "frontImage" }, { name: "backImage" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        category,
        availability,
        tags,
        unit,
        description,
        sizes,
        price,
      } = req.body;

      const parsedSizes = sizes ? JSON.parse(sizes) : [];

      const frontImagePath = req.files?.frontImage?.[0]?.path;
      const backImagePath = req.files?.backImage?.[0]?.path;

      const updates = {
        name,
        category,
        availability,
        tags,
        unit,
        description,
        price,
        sizes: parsedSizes.filter(
          (s, index, self) => index === self.findIndex((t) => t.size === s.size)
        ),
      };

      if (frontImagePath) updates.frontImage = `/${frontImagePath}`;
      if (backImagePath) updates.backImage = `/${backImagePath}`;

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
  }
);

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
