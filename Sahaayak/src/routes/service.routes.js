const express = require("express");

const router = express.Router();

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createService
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateService
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteService
);

module.exports = router;