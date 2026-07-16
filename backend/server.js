import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";

// Routes imports
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "An internal server error occurred",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Start Server after DB Connection
const startServer = async () => {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`🚀 SellYourPhone24 backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ FAILED to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
