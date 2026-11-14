import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intelligently find backend/.env regardless of execution working directory
const envPaths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}
dotenv.config();

const getConnectionString = () => process.env.MONGODB_CONNECTION || process.env.MONGODB_URI || "";
const getBuyConnectionString = () => process.env.MONGODB_BUY_CONNECTION || process.env.MONGODB_BUY_URI || "";
const getBuyDbName = () => process.env.MONGODB_BUY_DB || "buyphone24";

// Dedicated Buy-Phones database connection instance
// Either connected to an isolated database name on the same MongoDB server or dedicated connection URI
export const buyDb = getBuyConnectionString()
  ? mongoose.createConnection(getBuyConnectionString())
  : mongoose.connection.useDb(getBuyDbName(), { useCache: true });

export async function connectToMongoDB() {
  const connectionString = getConnectionString();
  const buyConnectionString = getBuyConnectionString();
  const buyDbName = getBuyDbName();

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
