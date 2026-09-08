const User = require("../models/User");


// ==========================================
// GET WORKER PROFILE
// ==========================================
const getWorkerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

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
        skills: Array.isArray(user.skills)
          ? user.skills
          : [],

        experience: Number(user.experience || 0),
        serviceRadius: Number(user.serviceRadius || 10),

        rating: Number(user.rating || 0),
        totalJobs: Number(user.totalJobs || 0),

        isVerified: Boolean(user.isVerified),

        verificationStatus:
          user.verificationStatus || "pending",

        availability:
          user.availability !== undefined
            ? Boolean(user.availability)
            : false,

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
      user.skills = Array.isArray(skills)
        ? skills
        : [];
    }

    if (experience !== undefined) {
      user.experience = Number(experience) || 0;
    }

    if (serviceRadius !== undefined) {
      user.serviceRadius =
        Number(serviceRadius) || 10;
    }

    if (location !== undefined) {
      let coordinates = [0, 0];

      if (
        Array.isArray(location.coordinates) &&
        location.coordinates.length === 2
      ) {
        coordinates = [
          Number(location.coordinates[0]),
          Number(location.coordinates[1]),
        ];
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
            ? Boolean(user.availability)
            : false,

        location: user.location,
      },
    });

  } catch (error) {
    console.error(
      "Update worker profile error:",
      error
    );

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

    // Don't allow unverified workers to become available
    if (
      availability === true &&
      user.verificationStatus !== "verified"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Worker must be verified before becoming available.",
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
    console.error(
      "Update availability error:",
      error
    );

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
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    const formattedWorkers = workers.map(
      (worker) => ({
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,

        occupation:
          worker.occupation || "",

        skills:
          Array.isArray(worker.skills)
            ? worker.skills
            : [],

        experience:
          Number(worker.experience || 0),

        serviceRadius:
          Number(worker.serviceRadius || 10),

        rating:
          Number(worker.rating || 0),

        totalJobs:
          Number(worker.totalJobs || 0),

        isVerified:
          Boolean(worker.isVerified),

        verificationStatus:
          worker.verificationStatus ||
          "pending",

        availability:
          worker.availability !== undefined
            ? Boolean(worker.availability)
            : false,

        location:
          worker.location || {
            type: "Point",
            coordinates: [0, 0],
            state: "",
            city: "",
            address: "",
          },

        createdAt: worker.createdAt,
      })
    );

    return res.status(200).json({
      success: true,
      workers: formattedWorkers,
    });

  } catch (error) {
    console.error(
      "Get all workers error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load workers",
      error: error.message,
    });
  }
};


// ==========================================
// APPROVE / REJECT WORKER
// ==========================================
const updateVerification = async (req, res) => {
  try {
    const { workerId } = req.params;

    const {
      verificationStatus,
      isVerified,
    } = req.body;

    const worker = await User.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    if (worker.role !== "worker") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a worker",
      });
    }


    // ======================================
    // APPROVE
    // ======================================
    if (
      verificationStatus === "verified" ||
      isVerified === true
    ) {
      worker.verificationStatus = "verified";
      worker.isVerified = true;

      // Approved workers can receive jobs
      worker.availability = true;
    }


    // ======================================
    // REJECT
    // ======================================
    else if (
      verificationStatus === "rejected" ||
      isVerified === false
    ) {
      worker.verificationStatus = "rejected";
      worker.isVerified = false;

      // Rejected workers cannot receive jobs
      worker.availability = false;
    }


    // ======================================
    // PENDING
    // ======================================
    else {
      worker.verificationStatus =
        verificationStatus || "pending";

      worker.isVerified = false;
      worker.availability = false;
    }

    await worker.save();

    return res.status(200).json({
      success: true,
      message:
        worker.verificationStatus === "verified"
          ? "Worker approved successfully"
          : worker.verificationStatus === "rejected"
          ? "Worker rejected successfully"
          : "Worker verification updated",

      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        occupation: worker.occupation || "",
        skills: worker.skills || [],
        experience: worker.experience || 0,
        serviceRadius:
          worker.serviceRadius || 10,

        rating: worker.rating || 0,
        totalJobs: worker.totalJobs || 0,

        isVerified:
          worker.isVerified,

        verificationStatus:
          worker.verificationStatus,

        availability:
          worker.availability,
      },
    });

  } catch (error) {
    console.error(
      "Update verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update worker verification",
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