const mongoose = require("mongoose");

const workerTrainingSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    trainingProgramId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingProgram",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["enrolled", "in-progress", "completed", "cancelled"],
      default: "enrolled",
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    certificateUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// A worker can enroll in a training program only once
workerTrainingSchema.index(
  { workerId: 1, trainingProgramId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "WorkerTraining",
  workerTrainingSchema
);