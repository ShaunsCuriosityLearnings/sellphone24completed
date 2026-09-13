import mongoose from "mongoose";

const searchQueryLogSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  resultCount: {
    type: Number,
    default: 0,
  },
  hasResults: {
    type: Boolean,
    default: true,
  },
  convertedToValuation: {
    type: Boolean,
    default: false,
  },
  convertedToLead: {
    type: Boolean,
    default: false,
  },
  sessionId: {
    type: String,
    required: true,
  }
}, { timestamps: true });

searchQueryLogSchema.index({ createdAt: -1 });

export default mongoose.model("SearchQueryLog", searchQueryLogSchema);
