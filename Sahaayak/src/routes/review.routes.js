const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("customer"), (req, res) => {
  res.status(501).json({
    success: false,
    message: "Review service is currently unavailable",
  });
});

router.get("/", protect, (req, res) => {
  res.json({
    success: true,
    reviews: [],
  });
});

module.exports = router;