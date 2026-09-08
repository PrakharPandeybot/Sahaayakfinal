const User = require("../models/User");
const Worker = require("../models/Worker");

// ==========================================
// GET WORKER PROFILE
// ==========================================
const getWorkerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      worker: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,

        occupation: user.occupation || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        experience: Number(user.experience || 0),
        serviceRadius: Number(user.serviceRadius || 10),

        rating: Number(user.rating || 0),
        totalJobs: Number(user.totalJobs || 0),

        isVerified: Boolean(user.isVerified),
        verificationStatus:
          user.verificationStatus || "pending",

        availability:
          user.availability !== undefined
            ? user.availability
            : true,

        location: user.location || {
          type: "Point",
          coordinates: [0, 0],
          state: "",
          city: "",
          address: "",
        },

        certifications: user.certifications || [],
        language: user.language || "en",
        age: user.age || null,
        income: user.income || null,
      },
    });
  } catch (error) {
    console.error("Get worker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load worker profile",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE WORKER PROFILE
// ==========================================
const updateWorkerProfile = async (req, res) => {
  try {
    const {
      occupation,
      skills,
      experience,
      serviceRadius,
      location,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (occupation !== undefined) {
      user.occupation = occupation;
    }

    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : [];
    }

    if (experience !== undefined) {
      user.experience = Number(experience) || 0;
    }

    if (serviceRadius !== undefined) {
      user.serviceRadius = Number(serviceRadius) || 10;
    }

    if (location !== undefined) {
      let coordinates = [0, 0];

      if (
        Array.isArray(location.coordinates) &&
        location.coordinates.length === 2
      ) {
        coordinates = location.coordinates.map(Number);
      }

      user.location = {
        type: "Point",
        coordinates,
        state: location.state || "",
        city: location.city || "",
        address: location.address || "",
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
      worker: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        occupation: user.occupation || "",
        skills: user.skills || [],
        experience: user.experience || 0,
        serviceRadius: user.serviceRadius || 10,
        rating: user.rating || 0,
        totalJobs: user.totalJobs || 0,
        isVerified: Boolean(user.isVerified),
        verificationStatus:
          user.verificationStatus || "pending",
        availability:
          user.availability !== undefined
            ? user.availability
            : true,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Update worker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update worker profile",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE AVAILABILITY
// ==========================================
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.availability = Boolean(availability);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated",
      availability: user.availability,
    });
  } catch (error) {
    console.error("Update availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update availability",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL WORKERS
// ==========================================
const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({
      role: "worker",
    }).select("-password");

    return res.status(200).json({
      success: true,
      workers,
    });
  } catch (error) {
    console.error("Get all workers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load workers",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE VERIFICATION
// ==========================================
const updateVerification = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { verificationStatus, isVerified } = req.body;

    const user = await User.findById(workerId);

    if (!user || user.role !== "worker") {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (verificationStatus !== undefined) {
      user.verificationStatus = verificationStatus;
    }

    if (isVerified !== undefined) {
      user.isVerified = Boolean(isVerified);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Worker verification updated",
      worker: user,
    });
  } catch (error) {
    console.error("Update verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update worker verification",
      error: error.message,
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  getWorkerProfile,
  updateWorkerProfile,
  updateAvailability,
  getAllWorkers,
  updateVerification,
};