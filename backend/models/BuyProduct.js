import mongoose from "mongoose";

const buyProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Listing title is required"],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, "Brand is required"],
    trim: true,
  },
  model: {
    type: String,
    required: [true, "Model name is required"],
    trim: true,
  },
  originalProductRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  category: {
    type: String,
    default: "smartphones",
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Selling price in AED is required"],
  },
  originalPrice: {
    type: Number,
  },
  condition: {
    type: String,
    enum: ["Pristine (Like New)", "Grade A (Excellent)", "Grade B (Good Value)"],
    default: "Pristine (Like New)",
  },
  batteryHealth: {
    type: String,
    default: "95%+",
  },
  warranty: {
    type: String,
    default: "12 Months Comprehensive Store Warranty",
  },
  storages: [
    {
      size: { type: String, required: true },
      priceBoost: { type: Number, default: 0 },
    }
  ],
  selectedStorage: {
    type: String,
  },
  colors: [
    { type: String }
  ],
  images: {
    frontView: { type: String, required: true },
    sideView: { type: String },
    backView: { type: String },
  },
  description: {
    type: String,
    trim: true,
  },
  features: [
    { type: String }
  ],
  stock: {
    type: Number,
    default: 1,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.9,
  },
  reviewCount: {
    type: Number,
    default: 15,
  }
}, { timestamps: true });

export default mongoose.model("BuyProduct", buyProductSchema);
