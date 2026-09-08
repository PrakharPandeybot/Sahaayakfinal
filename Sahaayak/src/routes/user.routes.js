const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/me", (req, res) => {
  res.json({
    success: true,
    user: req.user || null,
  });
});

module.exports = router;