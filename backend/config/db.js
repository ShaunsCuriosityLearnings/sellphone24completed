import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION || process.env.MONGODB_URI || "";
const buyConnectionString = process.env.MONGODB_BUY_CONNECTION || process.env.MONGODB_BUY_URI || "";
const buyDbName = process.env.MONGODB_BUY_DB || "buyphone24";

// Dedicated Buy-Phones database connection instance
// Either connected to an isolated database name on the same MongoDB server or dedicated connection URI
export const buyDb = buyConnectionString
  ? mongoose.createConnection(buyConnectionString)
  : mongoose.connection.useDb(buyDbName, { useCache: true });

export async function connectToMongoDB() {
  if (!connectionString) {
    throw new Error("MONGODB_CONNECTION or MONGODB_URI environment variable is missing in backend/.env!");
  }
  try {
    await mongoose.connect(connectionString);
    console.log("✅ Sell-Phone Database Connected Successfully!");

    if (buyConnectionString) {
      console.log("✅ Buy-Phone Database Connected to Dedicated URI Successfully!");
    } else {
      console.log(`✅ Buy-Phone Database Isolated in Dedicated DB: "${buyDbName}"!`);
    }

    return mongoose;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  if (buyConnectionString && buyDb && typeof buyDb.close === "function") {
    await buyDb.close();
  }
  await mongoose.connection.close();
}

export default connectToMongoDB;
