// models/Suggestion.js
import mongoose, { Schema } from "mongoose";

const SuggestionSchema = new Schema(
  {
    message: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Academics", "Facilities", "Others"],
      default: "Others",
      index: true,
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
      index: true,
    },
    sentimentScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Suggestion ||
  mongoose.model("Suggestion", SuggestionSchema);
