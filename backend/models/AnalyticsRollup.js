import mongoose from "mongoose";

const analyticsRollupSchema = new mongoose.Schema({
  dateStr: {
    type: String, // YYYY-MM-DD format
    required: true,
    index: true,
  },
  dimensionType: {
    type: String, // 'funnel', 'top_devices', 'pricing_elasticity', 'traffic_sources', 'search_demand', 'location_heat'
    required: true,
    index: true,
  },
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
}, { timestamps: true });

analyticsRollupSchema.index({ dateStr: 1, dimensionType: 1 }, { unique: true });

export default mongoose.model("AnalyticsRollup", analyticsRollupSchema);
