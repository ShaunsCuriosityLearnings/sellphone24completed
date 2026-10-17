import mongoose from "mongoose";

const buyOrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BuyProduct",
    required: false,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  selectedStorage: {
    type: String,
    default: "Standard",
  },
  selectedColor: {
    type: String,
    default: "Standard",
  },
  condition: {
    type: String,
    default: "Pristine (Like New)",
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  image: {
    type: String,
    default: "/products/iphone-pro-max.jpg",
  },
}, { _id: true });

const buyOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
  },
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
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Customer phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },
    building: {
      type: String,
      trim: true,
      default: "",
    },
    apartment: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: [true, "City / Emirate is required"],
      trim: true,
      default: "Dubai",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  items: [buyOrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "card_on_delivery"],
    default: "cod",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "dispatched", "delivered", "cancelled"],
    default: "pending",
    index: true,
  },
  googleSheetsSync: {
    isSynced: {
      type: Boolean,
      default: false,
    },
    syncedAt: {
      type: Date,
    },
    error: {
      type: String,
      default: null,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
  },
  marketingAttribution: {
    source: { type: String, default: "direct" },
    medium: { type: String, default: "none" },
    campaign: { type: String, default: "none" },
    referrer: { type: String, default: "direct" },
  },
}, { timestamps: true });

buyOrderSchema.index({ createdAt: -1 });

export default mongoose.model("BuyOrder", buyOrderSchema);
