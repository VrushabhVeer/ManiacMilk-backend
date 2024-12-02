import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGOURL;

const databaseConnection = async () => {
  if (!url) {
    console.error("MONGOURL is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

export default databaseConnection;
