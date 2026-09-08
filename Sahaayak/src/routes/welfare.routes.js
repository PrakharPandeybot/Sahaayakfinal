const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", (req, res) => {
  res.json({
    success: true,
    resources: [
      {
        title: "Government Welfare Schemes",
        description: "Access government welfare programs and benefits.",
      },
      {
        title: "Worker Support",
        description: "Information and resources for registered workers.",
      },
      {
        title: "Emergency Assistance",
        description: "Access emergency support information.",
      },
    ],
  });
});

module.exports = router;