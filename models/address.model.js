import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    house: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  },
);

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;