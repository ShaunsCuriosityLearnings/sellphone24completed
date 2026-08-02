import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { connectToMongoDB } from "./config/db.js";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import Blog from "./models/Blog.js";
import Order from "./models/Order.js";

async function restoreDatabase() {
  console.log("🔄 Starting MongoDB Database Restore from Backup...");
  try {
    await connectToMongoDB();

    const backupDir = path.join(process.cwd(), "backups");
    const latestPath = path.join(backupDir, "latest.json");

    if (!fs.existsSync(latestPath)) {
      throw new Error(`No backup file found at ${latestPath}. Run 'npm run backup' or 'node backup.js' first.`);
    }

    const raw = fs.readFileSync(latestPath, "utf-8");
    const backupData = JSON.parse(raw);

    console.log(`📅 Found Backup from: ${backupData.timestamp}`);
    console.log(
      `📊 Restoring: ${backupData.counts.products} Products, ${backupData.counts.categories} Categories, ${backupData.counts.brands} Brands, ${backupData.counts.blogs} Blogs, ${backupData.counts.orders} Orders.`
    );

    // Restore Categories
    if (Array.isArray(backupData.categories)) {
      for (const cat of backupData.categories) {
        await Category.findOneAndUpdate({ _id: cat._id }, cat, { upsert: true, new: true });
      }
    }

    // Restore Brands
    if (Array.isArray(backupData.brands)) {
      for (const br of backupData.brands) {
        await Brand.findOneAndUpdate({ _id: br._id }, br, { upsert: true, new: true });
      }
    }

    // Restore Products
    if (Array.isArray(backupData.products)) {
      for (const prod of backupData.products) {
        await Product.findOneAndUpdate({ _id: prod._id }, prod, { upsert: true, new: true });
      }
    }

    // Restore Blogs
    if (Array.isArray(backupData.blogs)) {
      for (const b of backupData.blogs) {
        await Blog.findOneAndUpdate({ _id: b._id }, b, { upsert: true, new: true });
      }
    }

    // Restore Orders
    if (Array.isArray(backupData.orders)) {
      for (const ord of backupData.orders) {
        await Order.findOneAndUpdate({ _id: ord._id }, ord, { upsert: true, new: true });
      }
    }

    console.log("🎉 Database successfully restored from backup snapshot!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Restore failed: ${error.message}`);
    process.exit(1);
  }
}

restoreDatabase();
