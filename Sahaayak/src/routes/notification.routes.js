const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// Get notifications
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    notifications: [],
    unreadCount: 0,
  });
});

// Mark one notification as read
router.patch("/:id/read", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});

// Mark all notifications as read
router.patch("/read-all", (req, res) => {
  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

module.exports = router;