const mongoose = require("mongoose");

const welfareSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    benefits: {
      type: String,
      required: true,
      trim: true,
    },

    eligibility: {
      type: String,
      required: true,
      trim: true,
    },

    requiredDocuments: [
      {
        type: String,
        trim: true,
      },
    ],

    applicationProcess: {
      type: String,
      required: true,
      trim: true,
    },

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

module.exports = mongoose.model("Welfare", welfareSchema);