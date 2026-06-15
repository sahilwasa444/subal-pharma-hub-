import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("MongoDB connection string is missing.");
    console.error("Set MONGO_URI in backend/.env like: MONGO_URI=mongodb+srv://<user>:<password>@cluster0.../dbname");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Before retrying, check: 1) correct URI, 2) valid credentials, 3) network access for your cluster, 4) database name and connection options.");
    process.exit(1);
  }
};

export default connectDB;