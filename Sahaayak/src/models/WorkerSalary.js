const mongoose = require("mongoose");

const workerSalarySchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    baseSalary: {
      type: Number,
      required: true,
      default: 10000,
      min: 0,
    },

    monthlyJobLimit: {
      type: Number,
      required: true,
      default: 40,
      min: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
      min: 0,
    },

    extraJobs: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeRate: {
      type: Number,
      default: 300,
      min: 0,
    },

    overtimePay: {
      type: Number,
      default: 0,
      min: 0,
    },

    performanceBonus: {
      type: Number,
      default: 0,
      min: 0,
    },

    adjustment: {
      type: Number,
      default: 0,
    },

    finalSalary: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "calculated", "paid"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One salary record per worker per month
workerSalarySchema.index(
  { workerId: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("WorkerSalary", workerSalarySchema);