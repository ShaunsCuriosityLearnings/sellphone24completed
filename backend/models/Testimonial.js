import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: "Dubai, UAE",
  },
  avatar: {
    type: String,
    trim: true,
  },
  quote: {
    type: String,
    required: [true, "Testimonial quote is required"],
    trim: true,
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
  isFeatured: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);
