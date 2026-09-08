const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", (req, res) => {
  res.json({
    success: true,
    payments: [],
  });
});

module.exports = router;