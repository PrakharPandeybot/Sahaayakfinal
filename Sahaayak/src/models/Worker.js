const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    // Reference to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    occupation: {
      type: String,
      required: [true, "Occupation is required"],
      trim: true
    },

    skills: [
      {
        type: String,
        trim: true
      }
    ],

    experience: {
      type: Number,
      min: 0,
      default: 0
    },

    certifications: [
      {
        name: {
          type: String,
          trim: true
        },

        issuingOrganization: {
          type: String,
          trim: true
        },

        certificateNumber: {
          type: String,
          trim: true
        },

        verified: {
          type: Boolean,
          default: false
        }
      }
    ],

    availability: {
      type: Boolean,
      default: false
    },

    serviceRadius: {
      type: Number,
      default: 10,
      min: 1
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },

      coordinates: {
        type: [Number],
        required: true
      }
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalJobs: {
      type: Number,
      default: 0
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

// Geospatial index
workerSchema.index({
  location: "2dsphere"
});

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;