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
import Testimonial from "./models/Testimonial.js";
import SeoPage from "./models/SeoPage.js";

async function restoreDatabase() {
  console.log("🔄 Starting Clean Hard MongoDB Database Restore from Backup...");
  try {
    await connectToMongoDB();

    const backupDir = path.join(process.cwd(), "backups");
    const latestPath = path.join(backupDir, "latest.json");

    if (!fs.existsSync(latestPath)) {
      throw new Error(`No backup file found at ${latestPath}. Place your backup file at backups/latest.json first.`);
    }

    const raw = fs.readFileSync(latestPath, "utf-8");
    const backupData = JSON.parse(raw);

    const productCount = Array.isArray(backupData.products) ? backupData.products.length : 0;
    const categoryCount = Array.isArray(backupData.categories) ? backupData.categories.length : 0;
    const brandCount = Array.isArray(backupData.brands) ? backupData.brands.length : 0;

    console.log(`📅 Found Backup Snapshot timestamp: ${backupData.timestamp || "N/A"}`);
    console.log(`📊 Backup Snapshot Contains: ${productCount} Products, ${categoryCount} Categories, ${brandCount} Brands.`);

    // STEP 1: CLEAR EXISTING COLLECTIONS TO ELIMINATE EXTRA/LEFTOVER MODELS
    console.log("🧹 Clearing existing collections...");
    await Promise.all([
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Blog.deleteMany({}),
      Order.deleteMany({}),
      Testimonial.deleteMany({}),
      SeoPage.deleteMany({})
    ]);

    // STEP 2: RE-INSERT EXACT BACKUP DATA
    console.log("📥 Re-inserting exact backup data...");
    if (Array.isArray(backupData.categories) && backupData.categories.length > 0) {
      await Category.insertMany(backupData.categories);
    }

    if (Array.isArray(backupData.brands) && backupData.brands.length > 0) {
      await Brand.insertMany(backupData.brands);
    }

    if (Array.isArray(backupData.products) && backupData.products.length > 0) {
      await Product.insertMany(backupData.products);
    }

    if (Array.isArray(backupData.blogs) && backupData.blogs.length > 0) {
      await Blog.insertMany(backupData.blogs);
    }

    if (Array.isArray(backupData.orders) && backupData.orders.length > 0) {
      await Order.insertMany(backupData.orders);
    }

    if (Array.isArray(backupData.testimonials) && backupData.testimonials.length > 0) {
      await Testimonial.insertMany(backupData.testimonials);
    }

    if (Array.isArray(backupData.seoPages) && backupData.seoPages.length > 0) {
      await SeoPage.insertMany(backupData.seoPages);
    }

    const finalCount = await Product.countDocuments();

    console.log("==========================================");
    console.log(`🎉 DATABASE RESTORE SUCCESSFUL!`);
    console.log(`📦 Database now contains EXACTLY ${finalCount} Products from your backup file.`);
    console.log("==========================================\n");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Restore failed: ${error.message}`);
    process.exit(1);
  }
}

restoreDatabase();
