import mongoose from "mongoose";
import { buyDb } from "../config/db.js";

const buyBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Brand name is required"],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Brand slug is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  logo: {
    type: String,
    required: [true, "Brand logo is required"],
    trim: true,
  },
  categories: [
    {
      type: String,
      trim: true,
    }
  ],
  isFeaturedOnFrontpage: {
    type: Boolean,
    default: false,
  },
  frontpageDisplayName: {
    type: String,
    trim: true,
  },
  frontpageImage: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Bind strictly to the isolated Buy-Phones database
const BuyBrand = buyDb.model("BuyBrand", buyBrandSchema, "buybrands");

export default BuyBrand;
