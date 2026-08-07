import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";
import Order from "../models/Order.js";
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

    const backupData = {
      version: "1.0",
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

// @desc    Restore database from JSON snapshot payload
// @route   POST /api/database/restore
// @access  Admin
export const restoreDatabase = async (req, res) => {
  try {
    const backupData = req.body;

    if (!backupData || (!backupData.products && !backupData.categories)) {
      return res.status(400).json({ message: "Invalid backup format. Must contain products or categories array." });
    }

    let restoredCounts = { categories: 0, brands: 0, products: 0, blogs: 0, orders: 0 };

    if (Array.isArray(backupData.categories)) {
      for (const cat of backupData.categories) {
        const filter = cat._id ? { _id: cat._id } : { slug: cat.slug };
        await Category.findOneAndUpdate(filter, cat, { upsert: true, new: true });
        restoredCounts.categories++;
      }
    }

    if (Array.isArray(backupData.brands)) {
      for (const br of backupData.brands) {
        const filter = br._id ? { _id: br._id } : { slug: br.slug };
        await Brand.findOneAndUpdate(filter, br, { upsert: true, new: true });
        restoredCounts.brands++;
      }
    }

    if (Array.isArray(backupData.products)) {
      for (const prod of backupData.products) {
        const filter = prod._id ? { _id: prod._id } : { name: prod.name, category: prod.category };
        await Product.findOneAndUpdate(filter, prod, { upsert: true, new: true });
        restoredCounts.products++;
      }
    }

    if (Array.isArray(backupData.blogs)) {
      for (const b of backupData.blogs) {
        const filter = b._id ? { _id: b._id } : { slug: b.slug };
        await Blog.findOneAndUpdate(filter, b, { upsert: true, new: true });
        restoredCounts.blogs++;
      }
    }

    if (Array.isArray(backupData.orders)) {
      for (const ord of backupData.orders) {
        if (ord._id) {
          await Order.findOneAndUpdate({ _id: ord._id }, ord, { upsert: true, new: true });
          restoredCounts.orders++;
        }
      }
    }

    // Update server's local latest.json backup file
    try {
      const backupDir = path.join(process.cwd(), "backups");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      fs.writeFileSync(path.join(backupDir, "latest.json"), JSON.stringify(backupData, null, 2));
    } catch (e) {}

    res.status(200).json({
      message: "Database successfully restored!",
      counts: restoredCounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Database restore failed: " + error.message });
  }
};
