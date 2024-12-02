import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  
  
});

const CartModel = mongoose.model("cart", cartSchema);

export default CartModel;
