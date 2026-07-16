import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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
  },
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
