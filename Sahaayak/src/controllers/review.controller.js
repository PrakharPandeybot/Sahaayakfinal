const {
  createReview: createReviewService,
  getWorkerReviews,
} = require("../services/review.service");

// ======================================
// CREATE REVIEW
// ======================================

const createReview = async (req, res) => {
  try {
    const { booking, rating, comment } = req.body;

    if (!booking || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Booking and rating are required",
      });
    }

    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const review = await createReviewService(
      booking,
      req.user._id,
      Number(rating),
      comment
    );

    const populatedReview = await review.populate([
      {
        path: "customer",
        select: "name email",
      },
      {
        path: "worker",
        select: "name email phone",
      },
      {
        path: "booking",
        select: "service scheduledDate address",
        populate: {
          path: "service",
          select: "name category",
        },
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    const clientErrors = [
      "Booking not found",
      "You are not authorized to review this booking",
      "Only completed bookings can be reviewed",
      "This booking has no assigned worker",
      "A review already exists for this booking",
    ];

    const statusCode = clientErrors.includes(error.message) ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

// ======================================
// GET WORKER REVIEWS
// ======================================

const getReviewsForWorker = async (req, res) => {
  try {
    const reviews = await getWorkerReviews(req.params.workerId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get worker reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker reviews",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getReviewsForWorker,
};