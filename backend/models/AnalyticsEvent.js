import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  eventName: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    enum: ["acquisition", "behaviour", "valuation", "conversion", "search", "ux"],
    required: true,
    index: true,
  },
  properties: {
    brand: { type: String },
    model: { type: String, index: true },
    categorySlug: { type: String },
    storage: { type: String },
    color: { type: String },
    condition: { type: String },
    calculatedPrice: { type: Number },
    hesitationMs: { type: Number },
    recalculationDelta: { type: Number },
    searchQuery: { type: String },
    resultCount: { type: Number },
    ctaName: { type: String },
    frictionField: { type: String },
    errorMessage: { type: String },
    pageUrl: { type: String },
    extra: { type: mongoose.Schema.Types.Mixed },
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  }
}, { timestamps: false });

// TTL index to automatically purge micro-events older than 60 days to optimize storage
analyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });
analyticsEventSchema.index({ eventName: 1, timestamp: -1 });
analyticsEventSchema.index({ "properties.model": 1, eventName: 1 });

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);
