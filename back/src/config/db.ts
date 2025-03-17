import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connection to MongoDB successful");
  } catch (error) {
    console.error("Connection to MongoDB failed:", error);
    process.exit(1);
  }
};

export default connectDB;
