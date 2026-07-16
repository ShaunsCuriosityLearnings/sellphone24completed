import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Brand is required"],
  },
  category: {
    type: String,
    required: [true, "Category slug is required"],
    trim: true,
  },
  basePrice: {
    type: Number,
    required: [true, "Base price is required"],
  },
  storages: [
    {
      size: { type: String, required: true },
      priceBoost: { type: Number, default: 0 },
    }
  ],
  colors: [
    { type: String }
  ],
  description: {
    type: String,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
  },
  images: {
    frontView: { type: String, required: true },
    sideView: { type: String },
    backView: { type: String }
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
