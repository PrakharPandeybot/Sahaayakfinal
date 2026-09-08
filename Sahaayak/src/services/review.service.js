const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Worker = require("../models/Worker");

// Create a review for a completed booking
const createReview = async (bookingId, customerId, rating, comment) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customer.toString() !== customerId.toString()) {
    throw new Error("You are not authorized to review this booking");
  }

  if (booking.status !== "completed") {
    throw new Error("Only completed bookings can be reviewed");
  }

  if (!booking.worker) {
    throw new Error("This booking has no assigned worker");
  }

  const existingReview = await Review.findOne({
    booking: bookingId,
  });

  if (existingReview) {
    throw new Error("A review already exists for this booking");
  }

  const review = await Review.create({
    booking: bookingId,
    customer: customerId,
    worker: booking.worker,
    rating,
    comment: comment || "",
  });

  // Recalculate the worker's average rating
  const ratingStats = await Review.aggregate([
    {
      $match: {
        worker: booking.worker,
      },
    },
    {
      $group: {
        _id: "$worker",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (ratingStats.length > 0) {
    await Worker.updateOne(
      { user: booking.worker },
      {
        $set: {
          rating: Number(ratingStats[0].averageRating.toFixed(2)),
        },
      }
    );
  }

  return review;
};

// Get reviews for a worker
const getWorkerReviews = async (workerId) => {
  return await Review.find({
    worker: workerId,
  })
    .populate("customer", "name")
    .populate("booking", "service scheduledDate")
    .sort({ createdAt: -1 });
};

module.exports = {
  createReview,
  getWorkerReviews,
};