import mongoose from "mongoose";

const customRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    deviceBrand: {
      type: String,
      required: true,
    },
    deviceModel: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ["flawless", "good", "average", "broken"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "contacted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const CustomRequest = mongoose.models.CustomRequest || mongoose.model("CustomRequest", customRequestSchema);
