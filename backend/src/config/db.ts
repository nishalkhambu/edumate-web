import mongoose from "mongoose";

/**
 * Establishes a connection to MongoDB using the MONGODB_URI environment variable.
 */
export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(
      "MongoDB connection failed. Make sure MongoDB is running and MONGODB_URI is correct."
    );
    throw error;
  }
};
