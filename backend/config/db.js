import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION || process.env.MONGODB_URI || "";

export async function connectToMongoDB() {
  if (!connectionString) {
    throw new Error("MONGODB_CONNECTION or MONGODB_URI environment variable is missing in backend/.env!");
  }
  try {
    await mongoose.connect(connectionString);
    console.log("✅ You successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}

export default connectToMongoDB;
