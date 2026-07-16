import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }
  ]
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);
