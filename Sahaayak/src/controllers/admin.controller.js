const User = require("../models/User");
const Worker = require("../models/Worker");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Welfare = require("../models/Welfare");
const Scheme = require("../models/Scheme");

const {
  getWorkersByStatus,
  updateWorkerVerificationStatus,
} = require("../services/admin.service");

// ======================================
// GET ADMIN DASHBOARD STATISTICS
// ======================================

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalWorkers,
      totalServices,
      totalBookings,
      totalPayments,
      totalWelfareSchemes,
      totalSchemes,
      pendingWorkers,
      pendingBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Worker.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Payment.countDocuments(),
      Welfare.countDocuments(),
      Scheme.countDocuments(),
      Worker.countDocuments({
        verificationStatus: "pending",
      }),
      Booking.countDocuments({
        status: "pending",
      }),
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        totalWorkers,
        totalServices,
        totalBookings,
        totalPayments,
        totalWelfareSchemes,
        totalSchemes,
        pendingWorkers,
        pendingBookings,
      },
    });
  } catch (error) {
    console.error("Get dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// ======================================
// GET WORKERS BY VERIFICATION STATUS
// ======================================

const getWorkers = async (req, res) => {
  try {
    const { status } = req.query;

    const workers = await getWorkersByStatus(status || "pending");

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("Get admin workers error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// VERIFY / REJECT WORKER
// ======================================

const updateWorkerVerification = async (req, res) => {
  try {
    const { verificationStatus } = req.body;

    if (!verificationStatus) {
      return res.status(400).json({
        success: false,
        message: "Verification status is required",
      });
    }

    const worker = await updateWorkerVerificationStatus(
      req.params.id,
      verificationStatus
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Worker verification status updated to ${verificationStatus}`,
      worker,
    });
  } catch (error) {
    console.error("Update worker verification error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getWorkers,
  updateWorkerVerification,
};