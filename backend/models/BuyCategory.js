import mongoose from "mongoose";
import { buyDb } from "../config/db.js";

const buyCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Category slug is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Category image is required"],
    default: "/products/iphone-pro-max.jpg",
  },
}, { timestamps: true });

// Bind strictly to the isolated Buy-Phones database
const BuyCategory = buyDb.model("BuyCategory", buyCategorySchema, "buycategories");

export default BuyCategory;
