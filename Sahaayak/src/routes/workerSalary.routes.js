const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(protect);

// Get worker salary information
router.get(
  "/",
  authorizeRoles("worker"),
  (req, res) => {
    res.status(200).json({
      success: true,
      salary: {
        completedJobs: 0,
        extraJobs: 0,
        monthlyJobLimit: 0,
        finalSalary: 0,
      },
    });
  }
);

// Admin can also access salary overview
router.get(
  "/admin",
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      salary: [],
    });
  }
);

module.exports = router;