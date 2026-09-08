const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "worker", "admin"],
      default: "customer",
    },

    language: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
    },

    availability: {
  type: Boolean,
  default: true,
},

rating: {
  type: Number,
  min: 0,
  max: 5,
  default: 0,
},

totalJobs: {
  type: Number,
  min: 0,
  default: 0,
},

experience: {
  type: Number,
  min: 0,
  default: 0,
},

serviceRadius: {
  type: Number,
  min: 1,
  max: 100,
  default: 10,
},

    // ======================================
    // WORKER PROFILE INFORMATION
    // ======================================

    occupation: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    certifications: [
      {
        name: {
          type: String,
          trim: true,
        },

        issuer: {
          type: String,
          trim: true,
          default: "",
        },

        issuedAt: {
          type: Date,
          default: null,
        },

        certificateUrl: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    age: {
      type: Number,
      min: 18,
      max: 100,
      default: null,
    },

    income: {
      type: Number,
      min: 0,
      default: null,
    },

    // ======================================
    // LOCATION
    // ======================================

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },

      state: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // ======================================
    // VERIFICATION
    // ======================================

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// For geo-location based worker matching
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);

module.exports = User;