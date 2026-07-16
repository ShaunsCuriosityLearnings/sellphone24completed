import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerDetails: {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Customer phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Pickup address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City/Emirate is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "Country is required"],
      default: "UAE",
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    }
  },
  pickupSchedule: {
    pickupDate: {
      type: String,
      required: [true, "Pickup date is required"],
    },
    pickupTime: {
      type: String,
      required: [true, "Pickup time slot is required"],
    }
  },
  devices: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      brand: { type: String, required: true },
      category: { type: String, required: true },
      selectedStorage: { type: String, required: true },
      selectedColor: { type: String, required: true },
      selectedCondition: { type: String, required: true },
      calculatedPrice: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    }
  ],
  paymentMethod: {
    type: String,
    enum: ["cash"],
    default: "cash",
    required: true,
  },
  totalPayout: {
    type: Number,
    required: [true, "Total payout is required"],
  },
  status: {
    type: String,
    enum: ["pending", "pickup_assigned", "inspected", "completed", "cancelled"],
    default: "pending",
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
