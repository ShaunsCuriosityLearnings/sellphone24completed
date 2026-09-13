import mongoose from "mongoose";

const analyticsSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  visitorHash: {
    type: String,
    index: true,
  },
  deviceType: {
    type: String, // 'mobile', 'desktop', 'tablet'
    default: "desktop",
  },
  browser: {
    type: String,
    default: "Unknown",
  },
  os: {
    type: String,
    default: "Unknown",
  },
  geo: {
    country: { type: String, default: "UAE" },
    city: { type: String, default: "Dubai" },
    emirate: { type: String, default: "Dubai" },
    area: { type: String, default: "" },
  },
  acquisition: {
    referrer: { type: String, default: "direct" },
    landingPage: { type: String, default: "/" },
    exitPage: { type: String, default: "/" },
    utmSource: { type: String, default: "direct" },
    utmMedium: { type: String, default: "none" },
    utmCampaign: { type: String, default: "none" },
    utmContent: { type: String, default: "none" },
    utmTerm: { type: String, default: "none" },
    channel: { type: String, default: "Organic / Direct" },
  },
  intentScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  maxStageReached: {
    type: String,
    enum: [
      "visitor",
      "browsed",
      "valuation_started",
      "valuation_completed",
      "offer_viewed",
      "offer_accepted",
      "lead_submitted",
      "pickup_requested",
      "device_collected",
      "completed_sale"
    ],
    default: "visitor",
  },
  recalculationCount: {
    type: Number,
    default: 0,
  },
  durationSeconds: {
    type: Number,
    default: 0,
  },
  linkedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
  totalPayoutOffered: {
    type: Number,
    default: 0,
  },
  isConverted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

analyticsSessionSchema.index({ createdAt: -1 });
analyticsSessionSchema.index({ maxStageReached: 1 });
analyticsSessionSchema.index({ "acquisition.utmSource": 1 });

export default mongoose.model("AnalyticsSession", analyticsSessionSchema);
