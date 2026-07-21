import dotenv from "dotenv";
dotenv.config();

import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import Blog from "./models/Blog.js";
import connectDB from "./config/db.js";

const clearDatabase = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Brand.deleteMany();
    await Product.deleteMany();
    await Blog.deleteMany();
    console.log("?? Database cleared (Categories, Brands, Products, & Blogs deleted)");
    process.exit(0);
  } catch (error) {
    console.error("? Clearing failed: ");
    process.exit(1);
  }
};

clearDatabase();
