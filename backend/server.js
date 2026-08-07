import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";

import fs from "fs";
import path from "path";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import Blog from "./models/Blog.js";
import Order from "./models/Order.js";

// Routes imports
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import customRequestRoutes from "./routes/customRequestRoutes.js";
import databaseRoutes from "./routes/databaseRoutes.js";

if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
  // Apply Clerk middleware only for modifying routes (non-GET requests) to prevent cookies from blocking public GET requests
  app.use((req, res, next) => {
    if (req.method === "GET") {
      return next();
    }
    clerkMiddleware()(req, res, next);
  });
} else {
  console.warn("⚠️ Warning: Clerk publishable or secret key is missing. Clerk authentication middleware will be bypassed.");
}

// API Root Status Route
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "Welcome to the SellYourPhone24 API" });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({ status: "OK", message: "SellYourPhone24 backend is running" });
});

// Map Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/custom-requests", customRequestRoutes);
app.use("/api/database", databaseRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "An internal server error occurred",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Helper to auto-restore from backups/latest.json if MongoDB is empty on start
const checkAndAutoRestoreDB = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const backupPath = path.join(process.cwd(), "backups", "latest.json");
      if (fs.existsSync(backupPath)) {
        console.log("⚡ Database is empty. Auto-restoring data from backups/latest.json...");
        const raw = fs.readFileSync(backupPath, "utf-8");
        const backupData = JSON.parse(raw);

        if (Array.isArray(backupData.categories)) {
          for (const c of backupData.categories) await Category.findOneAndUpdate({ _id: c._id }, c, { upsert: true });
        }
        if (Array.isArray(backupData.brands)) {
          for (const b of backupData.brands) await Brand.findOneAndUpdate({ _id: b._id }, b, { upsert: true });
        }
        if (Array.isArray(backupData.products)) {
          for (const p of backupData.products) await Product.findOneAndUpdate({ _id: p._id }, p, { upsert: true });
        }
        if (Array.isArray(backupData.blogs)) {
          for (const bl of backupData.blogs) await Blog.findOneAndUpdate({ _id: bl._id }, bl, { upsert: true });
        }
        console.log("✅ Auto-restore completed successfully!");
      }
    }
  } catch (err) {
    console.warn("⚠️ Auto-restore check encountered an issue:", err.message);
  }
};

// Start Server after DB Connection
const startServer = async () => {
  try {
    await connectToMongoDB();
    await checkAndAutoRestoreDB();
    app.listen(PORT, () => {
      console.log(`🚀 SellYourPhone24 backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ FAILED to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
