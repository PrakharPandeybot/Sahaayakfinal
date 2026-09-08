const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      trim: true,
    },

    planName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    coverageAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    premiumAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    premiumFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "half-yearly", "yearly"],
      default: "yearly",
    },

    eligibility: {
      type: String,
      required: true,
      trim: true,
    },

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    documentsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

    applicationUrl: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insurance", insuranceSchema);