import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

// Reuse MongoDB connection across Vercel serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  // Already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Connection is already being established
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,

      // Connection pool
      maxPoolSize: 10,
      minPoolSize: 0,

      // Timeout settings
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,

      // Don't wait too long for a free connection
      waitQueueTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("MongoDB connection error:", error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};