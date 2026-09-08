const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", (req, res) => {
  res.json({
    success: true,
    insurance: [],
  });
});

router.post("/", authorizeRoles("worker"), (req, res) => {
  res.status(501).json({
    success: false,
    message: "Insurance service is currently unavailable",
  });
});

module.exports = router;