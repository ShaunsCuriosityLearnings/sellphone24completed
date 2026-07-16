import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    desc: {
      type: String,
      required: [true, "Blog short description is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog body content is required"],
    },
    img: {
      type: String,
      default: "/products/iphone 17 pro max 💖.jpg",
    },
    category: {
      type: String,
      required: [true, "Blog category is required"],
      enum: ["Buying Guides", "Recycling Tips", "Price Analysis"],
      trim: true,
    },
    author: {
      type: String,
      default: "Team SellYourPhone24",
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
