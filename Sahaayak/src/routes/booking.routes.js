const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/booking.controller");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createBooking
);

router.get(
  "/my",
  protect,
  authorizeRoles("customer"),
  getMyBookings
);

router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelBooking
);

router.get(
  "/worker",
  protect,
  authorizeRoles("worker"),
  getWorkerBookings
);

router.patch(
  "/:id/accept",
  protect,
  authorizeRoles("worker"),
  acceptBooking
);

router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("worker"),
  rejectBooking
);

router.get(
  "/:id",
  protect,
  getBookingById
);

router.patch(
  "/:id/status",
  protect,
  updateBookingStatus
);

module.exports = router;