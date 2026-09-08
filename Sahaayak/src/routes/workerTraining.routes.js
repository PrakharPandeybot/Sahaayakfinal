const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    training: [
      {
        id: "service-skills",
        title: "Service Skills Development",
        description:
          "Improve practical skills for household and community services.",
        status: "available",
      },
      {
        id: "customer-handling",
        title: "Customer Handling",
        description:
          "Learn professional communication and customer service.",
        status: "available",
      },
      {
        id: "safety",
        title: "Workplace Safety",
        description:
          "Learn essential safety practices for field work.",
        status: "available",
      },
    ],
  });
});

router.post("/:id/enroll", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Training enrollment successful",
    trainingId: req.params.id,
  });
});

router.get("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    training: {
      id: req.params.id,
      title: "Worker Training",
      description:
        "Training program for Sahaayak workers.",
      status: "available",
    },
  });
});

module.exports = router;