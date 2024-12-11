import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String },
  email: { type: String, unique: true },
  mobile: { type: Number },
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
