const express = require("express");
const router = express.Router();

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  getWorkerProfile,
  updateWorkerProfile,
  updateAvailability,
  getAllWorkers,
  updateVerification,
} = require("../controllers/workerController");

const {
  findMatchingWorkers,
} = require("../services/matching.service");


// ===============================
// WORKER PROFILE
// ===============================

router.get(
  "/profile",
  protect,
  authorizeRoles("worker"),
  getWorkerProfile
);

router.post(
  "/profile",
  protect,
  authorizeRoles("worker"),
  updateWorkerProfile
);

router.put(
  "/profile",
  protect,
  authorizeRoles("worker"),
  updateWorkerProfile
);


// ===============================
// WORKER AVAILABILITY
// ===============================

router.patch(
  "/availability",
  protect,
  authorizeRoles("worker"),
  updateAvailability
);


// ===============================
// CUSTOMER → FIND WORKERS
// ===============================

router.get(
  "/matching",
  protect,
  authorizeRoles("customer"),
  async (req, res) => {
    try {
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);

      const occupation = req.query.occupation || "";

      const maxDistanceKm =
        Number(req.query.maxDistanceKm) || 10;

      console.log("\n==============================");
      console.log("WORKER MATCHING REQUEST");
      console.log("==============================");
      console.log("Latitude:", lat);
      console.log("Longitude:", lng);
      console.log("Occupation:", occupation);
      console.log("Max distance:", maxDistanceKm);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid latitude and longitude are required.",
          workers: [],
        });
      }

      const workers = await findMatchingWorkers(
        {
          type: "Point",
          coordinates: [lng, lat],
        },
        occupation,
        maxDistanceKm
      );

      console.log(
        "Workers matched:",
        workers.length
      );

      if (workers.length > 0) {
        console.log(
          "Best worker:",
          workers[0].name,
          "|",
          workers[0].occupation
        );
      }

      console.log("==============================\n");

      return res.status(200).json({
        success: true,
        workers,
        matchingWorkers: workers,
        count: workers.length,
      });

    } catch (error) {
      console.error(
        "Worker matching route error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to find matching workers.",
        workers: [],
      });
    }
  }
);


// ===============================
// ADMIN → ALL WORKERS
// ===============================

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllWorkers
);


// ===============================
// ADMIN → VERIFY WORKER
// ===============================

router.patch(
  "/:workerId/verification",
  protect,
  authorizeRoles("admin"),
  updateVerification
);


module.exports = router;