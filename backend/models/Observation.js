import mongoose from "mongoose";

const observationSchema = new mongoose.Schema(
  {
    species: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    conservationStatus: {
      type: String, // 'endangered', 'vulnerable', 'protected'
      default: "protected"
    },

    // ✅ SINGLE SOURCE OF TRUTH
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Observation", observationSchema);
