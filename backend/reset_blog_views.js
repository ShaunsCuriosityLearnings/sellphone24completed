import dotenv from "dotenv";
dotenv.config();

import Blog from "./models/Blog.js";
import { connectToMongoDB } from "./config/db.js";

const resetBlogViews = async () => {
  try {
    await connectToMongoDB();
    console.log("⚡ Resetting all legacy blog view counters to 0 in MongoDB...");

    const result = await Blog.updateMany({}, { $set: { views: 0, likes: 0 } });

    console.log(`✅ Successfully reset view counters to 0 across ${result.modifiedCount} blog posts!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to reset blog views:", err);
    process.exit(1);
  }
};

resetBlogViews();
