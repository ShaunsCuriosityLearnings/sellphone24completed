import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";
import Order from "../models/Order.js";
import Testimonial from "../models/Testimonial.js";
import fs from "fs";
import path from "path";

// @desc    Export full database as JSON snapshot download
// @route   GET /api/database/export
// @access  Admin / Public for admin export
export const exportDatabase = async (req, res) => {
  try {
    const categories = await Category.find({}).lean();
    const brands = await Brand.find({}).lean();
    const products = await Product.find({}).lean();
    const blogs = await Blog.find({}).lean();
    const orders = await Order.find({}).lean();
    const testimonials = await Testimonial.find({}).lean();

    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      counts: {
        categories: categories.length,
        brands: brands.length,
        products: products.length,
        blogs: blogs.length,
        orders: orders.length,
        testimonials: testimonials.length,
      },
      categories,
      brands,
      products,
      blogs,
      orders,
      testimonials,
    };

    // Save a copy to backups/latest.json locally on server
    try {
      const backupDir = path.join(process.cwd(), "backups");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      fs.writeFileSync(path.join(backupDir, "latest.json"), JSON.stringify(backupData, null, 2));
    } catch (e) {
      console.warn("Could not save local latest.json backup file:", e.message);
    }

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `sellphonecash-db-backup-${dateStr}.json`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Failed to export database: " + error.message });
  }
};

// @desc    Export products catalog only as JSON
// @route   GET /api/database/export/products
// @access  Admin
export const exportProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("brand").lean();
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `products-catalog-${dateStr}.json`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(products, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Failed to export products: " + error.message });
  }
};

// @desc    Restore database from JSON snapshot payload (Clean Hard Restore)
// @route   POST /api/database/restore
// @access  Admin
export const restoreDatabase = async (req, res) => {
  try {
    req.setTimeout(300000); // 5 min timeout
    res.setTimeout(300000);

    const backupData = req.body;

    if (!backupData || (!backupData.products && !backupData.categories)) {
      return res.status(400).json({ message: "Invalid backup format. Must contain products or categories array." });
    }

    // STEP 1: HARD CLEAR ALL COLLECTIONS TO ELIMINATE ANY EXTRA OR SEEDED MODELS
    await Promise.all([
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Blog.deleteMany({}),
      Order.deleteMany({}),
      Testimonial.deleteMany({})
    ]);

    // STEP 2: FAST BULK RE-INSERT EXACT BACKUP DATA
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
      await Order.insertMany(backupData.orders.filter(ord => ord._id));
    }

    if (Array.isArray(backupData.testimonials) && backupData.testimonials.length > 0) {
      await Testimonial.insertMany(backupData.testimonials);
    }

    // Save as latest.json on server
    try {
      const backupDir = path.join(process.cwd(), "backups");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      fs.writeFileSync(path.join(backupDir, "latest.json"), JSON.stringify(backupData, null, 2));
    } catch (e) {}

    const productCount = Array.isArray(backupData.products) ? backupData.products.length : 0;

    res.status(200).json({
      message: `Database successfully restored to exact backup snapshot!`,
      counts: {
        products: productCount,
        brands: backupData.brands ? backupData.brands.length : 0,
        categories: backupData.categories ? backupData.categories.length : 0
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Database restore failed: " + error.message });
  }
};
