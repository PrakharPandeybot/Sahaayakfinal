const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", (req, res) => {
  res.json({
    success: true,
    schemes: [
      {
        name: "PM SVANidhi",
        description: "Financial support scheme for eligible street vendors.",
      },
      {
        name: "Pradhan Mantri Shram Yogi Maandhan",
        description: "Pension scheme for eligible unorganised workers.",
      },
      {
        name: "e-Shram",
        description: "National database and support platform for unorganised workers.",
      },
    ],
  });
});

module.exports = router;