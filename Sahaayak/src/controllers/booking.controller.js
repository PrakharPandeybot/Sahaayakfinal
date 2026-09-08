const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { findMatchingWorkers } = require("../services/matching.service");
const { createNotification } = require("../services/notification.service");
const {
  updateWorkerJobCount,
} = require("../services/workerSalary.service");

// ======================================
// PREVIEW MATCHING WORKER
// ======================================

const previewMatchingWorker = async (req, res) => {
  try {
    const { service, location } = req.body;

    if (
      !service ||
      !location ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Service and valid location coordinates are required",
      });
    }

    const serviceExists = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    const matchingWorkers = await findMatchingWorkers(
      location,
      serviceExists.category,
      10
    );

    if (!matchingWorkers.length) {
      return res.status(200).json({
        success: true,
        matchingWorkerFound: false,
        worker: null,
      });
    }

    return res.status(200).json({
      success: true,
      matchingWorkerFound: true,
      worker: matchingWorkers[0],
    });
  } catch (error) {
    console.error("Preview matching worker error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to find matching worker",
      error: error.message,
    });
  }
};

// ======================================
// CREATE BOOKING
// ======================================

const createBooking = async (req, res) => {
  try {
    const {
      service,
      scheduledDate,
      address,
      location,
      description,
    } = req.body;

    if (
      !service ||
      !scheduledDate ||
      !address ||
      !location ||
      !location.coordinates
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Service, scheduled date, address and location are required",
      });
    }

    if (
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates must be [longitude, latitude]",
      });
    }

    const bookingDate = new Date(scheduledDate);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date",
      });
    }

    if (bookingDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date must be in the future",
      });
    }

    const serviceExists = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    const matchingWorkers = await findMatchingWorkers(
      location,
      serviceExists.category,
      10
    );

    const matchedWorker =
      matchingWorkers.length > 0
        ? matchingWorkers[0]
        : null;

    const booking = await Booking.create({
      customer: req.user._id,
      worker: matchedWorker
        ? matchedWorker.user._id
        : null,
      service,
      scheduledDate: bookingDate,
      address,
      location,
      description: description || "",
      price: serviceExists.basePrice,
      status: "pending",
    });

    // Notify matched worker
    if (matchedWorker) {
      await createNotification({
        recipient: matchedWorker.user._id,
        type: "booking",
        title: "New Booking Assigned",
        message: `You have a new ${serviceExists.name} booking request.`,
        booking: booking._id,
      });
    }

    const populatedBooking = await Booking.findById(
      booking._id
    )
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    return res.status(201).json({
      success: true,
      message: matchedWorker
        ? "Booking created and worker matched successfully"
        : "Booking created successfully. No matching worker is currently available.",
      matchingWorkerFound: !!matchedWorker,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// ======================================
// GET MY BOOKINGS
// ======================================

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// ======================================
// GET WORKER BOOKINGS
// ======================================

const getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      worker: req.user._id,
    })
      .populate("customer", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get worker bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// ======================================
// GET BOOKING BY ID
// ======================================

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const userId = req.user._id.toString();

    const customerId = booking.customer
      ? booking.customer._id.toString()
      : null;

    const workerId = booking.worker
      ? booking.worker._id.toString()
      : null;

    if (customerId !== userId && workerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

// ======================================
// ACCEPT BOOKING
// ======================================

const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be accepted because its status is ${booking.status}`,
      });
    }

    if (
      booking.worker &&
      booking.worker.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This booking is assigned to another worker",
      });
    }

    booking.worker = req.user._id;
    booking.status = "accepted";

    await booking.save();

    await createNotification({
      recipient: booking.customer,
      type: "booking",
      title: "Booking Accepted",
      message: "Your booking has been accepted by the worker.",
      booking: booking._id,
    });

    const updatedBooking = await Booking.findById(
      booking._id
    )
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    return res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Accept booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept booking",
      error: error.message,
    });
  }
};

// ======================================
// REJECT BOOKING
// ======================================

const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be rejected because its status is ${booking.status}`,
      });
    }

    if (
      booking.worker &&
      booking.worker.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This booking is assigned to another worker",
      });
    }

    booking.worker = null;
    booking.status = "rejected";

    await booking.save();

    await createNotification({
      recipient: booking.customer,
      type: "booking",
      title: "Booking Rejected",
      message: "Your booking request was rejected by the worker.",
      booking: booking._id,
    });

    const updatedBooking = await Booking.findById(
      booking._id
    )
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    return res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject booking",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE BOOKING STATUS
// ======================================

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const userId = req.user._id.toString();
    const customerId = booking.customer.toString();

    const workerId = booking.worker
      ? booking.worker.toString()
      : null;

    const isCustomer = customerId === userId;
    const isWorker = workerId === userId;

    if (!isCustomer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this booking",
      });
    }

    if (isCustomer) {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customer can only cancel a booking",
        });
      }

      if (
        ["completed", "cancelled"].includes(
          booking.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Booking cannot be cancelled because its status is ${booking.status}`,
        });
      }
    }

    if (isWorker) {
      const validWorkerTransitions = {
        accepted: ["in-progress", "cancelled"],
        "in-progress": ["completed", "cancelled"],
      };

      const allowedNextStatuses =
        validWorkerTransitions[booking.status] || [];

      if (!allowedNextStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Booking cannot be changed from ${booking.status} to ${status}`,
        });
      }
    }

    const previousStatus = booking.status;

    booking.status = status;

    await booking.save();

    // ======================================
    // WORKER SALARY
    // ======================================

    if (
      status === "completed" &&
      previousStatus !== "completed" &&
      booking.worker
    ) {
      try {
        const salary = await updateWorkerJobCount(
          booking.worker
        );

        console.log(
          `Worker ${booking.worker} completed a job. ` +
            `Monthly jobs: ${salary.completedJobs}, ` +
            `Extra jobs: ${salary.extraJobs}, ` +
            `Final salary: ₹${salary.finalSalary}`
        );

        await createNotification({
          recipient: booking.worker,
          type: "payment",
          title: "Job Completed - Earnings Updated",
          message:
            salary.extraJobs > 0
              ? `Your monthly earnings have been updated. You earned overtime for this job. Current estimated salary: ₹${salary.finalSalary}.`
              : `Your monthly job count is ${salary.completedJobs}/${salary.monthlyJobLimit}. Current estimated salary: ₹${salary.finalSalary}.`,
          booking: booking._id,
        });
      } catch (salaryError) {
        console.error(
          "Worker salary update error:",
          salaryError.message
        );
      }
    }

    // ======================================
    // NOTIFICATIONS
    // ======================================

    if (status === "completed") {
      await createNotification({
        recipient: booking.customer,
        type: "booking",
        title: "Booking Completed",
        message: "Your service booking has been completed.",
        booking: booking._id,
      });
    } else if (status === "in-progress") {
      await createNotification({
        recipient: booking.customer,
        type: "booking",
        title: "Service In Progress",
        message:
          "Your worker has started working on your booking.",
        booking: booking._id,
      });
    } else if (status === "cancelled") {
      const recipient = isCustomer
        ? booking.worker
        : booking.customer;

      if (recipient) {
        await createNotification({
          recipient,
          type: "booking",
          title: "Booking Cancelled",
          message:
            "A booking you are involved in has been cancelled.",
          booking: booking._id,
        });
      }
    }

    const updatedBooking = await Booking.findById(
      booking._id
    )
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

// ======================================
// CANCEL BOOKING
// ======================================

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the customer can cancel this booking",
      });
    }

    if (
      ["completed", "cancelled"].includes(
        booking.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled because its status is ${booking.status}`,
      });
    }

    booking.status = "cancelled";

    await booking.save();

    if (booking.worker) {
      await createNotification({
        recipient: booking.worker,
        type: "booking",
        title: "Booking Cancelled",
        message:
          "The customer has cancelled the booking.",
        booking: booking._id,
      });
    }

    const updatedBooking = await Booking.findById(
      booking._id
    )
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate(
        "service",
        "name category description basePrice estimatedDuration"
      );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  createBooking,
  previewMatchingWorker,
  getMyBookings,
  getWorkerBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  cancelBooking,
};