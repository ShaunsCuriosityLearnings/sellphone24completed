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

async function backupDatabase() {
  console.log("📦 Starting MongoDB Database Backup...");
  try {
    await connectToMongoDB();

    const categories = await Category.find({}).lean();
    const brands = await Brand.find({}).lean();
    const products = await Product.find({}).lean();
    const blogs = await Blog.find({}).lean();
    const orders = await Order.find({}).lean();

    const backupData = {
      timestamp: new Date().toISOString(),
      counts: {
        categories: categories.length,
        brands: brands.length,
        products: products.length,
        blogs: blogs.length,
        orders: orders.length,
      },
      categories,
      brands,
      products,
      blogs,
      orders,
    };

    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestampStr = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${timestampStr}.json`;
    const latestPath = path.join(backupDir, "latest.json");
    const historyPath = path.join(backupDir, filename);

    fs.writeFileSync(latestPath, JSON.stringify(backupData, null, 2));
    fs.writeFileSync(historyPath, JSON.stringify(backupData, null, 2));

    console.log(`✅ Backup successfully saved!`);
    console.log(`📁 History Backup: ${historyPath}`);
    console.log(`📌 Latest Backup: ${latestPath}`);
    console.log(
      `📊 Summary: ${products.length} Products, ${categories.length} Categories, ${brands.length} Brands, ${blogs.length} Blogs, ${orders.length} Orders.`
    );

    process.exit(0);
  } catch (error) {
    console.error(`❌ Backup failed: ${error.message}`);
    process.exit(1);
  }
}

backupDatabase();
