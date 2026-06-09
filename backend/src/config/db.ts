import mongoose from "mongoose";

/**
 * Establishes a connection to MongoDB using the MONGODB_URI environment variable.
 */
export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};
