import mongoose from "mongoose";

const selectedSizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    price: { type: Number, required: true },
    _id: { type: String, required: true },
  },
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // ID of the user
    items: [
      {
        productId: { type: String, required: true }, // ID of the product
        name: { type: String, required: true },
        frontImage: { type: String, required: true },
        // backImage: { type: String },
        // category: { type: String, required: true },
        // availability: { type: String, required: true },
        // tags: [String],
        // unit: { type: String },
        // description: { type: String },
        // sizes: [
        //   {
        //     size: { type: String },
        //     price: { type: Number },
        //     _id: { type: String },
        //   },
        // ],
        selectedSize: selectedSizeSchema,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model("cart", cartSchema);

export default CartModel;
