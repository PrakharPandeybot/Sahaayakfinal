const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    training: [
      {
        id: "basic-service-skills",
        title: "Basic Service Skills",
        description:
          "Learn essential skills for delivering reliable household services.",
        status: "available",
      },
      {
        id: "customer-service",
        title: "Customer Service",
        description:
          "Improve communication, professionalism and customer satisfaction.",
        status: "available",
      },
      {
        id: "workplace-safety",
        title: "Workplace Safety",
        description:
          "Learn basic safety practices while working at customer locations.",
        status: "available",
      },
    ],
  });
});

router.get("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    training: {
      id: req.params.id,
      title: "Worker Training Program",
      description:
        "Training resources for Sahaayak service providers.",
      status: "available",
    },
  });
});

module.exports = router;