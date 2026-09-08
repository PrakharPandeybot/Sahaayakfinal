const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Admin API is available",
  });
});

module.exports = router;