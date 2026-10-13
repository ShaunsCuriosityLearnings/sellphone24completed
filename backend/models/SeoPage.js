import mongoose from "mongoose";

const seoPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    pageType: {
      type: String,
      enum: ["service", "model", "location", "hub"],
      default: "service",
    },
    title: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    customH1: {
      type: String,
      trim: true,
    },
    customSubtitle: {
      type: String,
      trim: true,
    },
    customHeroImage: {
      type: String,
      trim: true,
    },
    customQuoteBadge: {
      type: String,
      trim: true,
    },
    customQuotePrice: {
      type: Number,
    },
    featuredProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    targetKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
    seoScore: {
      type: Number,
      default: 88,
      min: 0,
      max: 100,
    },
    rankTracking: [
      {
        keyword: { type: String, required: true },
        position: { type: Number, default: 0 },
        checkedAt: { type: Date, default: Date.now },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SeoPage", seoPageSchema);
