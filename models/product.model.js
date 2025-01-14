import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    frontImage: {
      type: String,
    },
    backImage: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
    tags: {
      type: [String],
      default: [],
    },
    unit: {
      type: String,
      enum: ["Ltr", "Kg"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
          unique: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;
