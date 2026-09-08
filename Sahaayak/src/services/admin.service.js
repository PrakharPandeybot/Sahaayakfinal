const Worker = require("../models/Worker");
const { createNotification } = require("./notification.service");

// ======================================
// GET WORKERS BY VERIFICATION STATUS
// ======================================

const getWorkersByStatus = async (verificationStatus = "pending") => {
  const allowedStatuses = ["pending", "verified", "rejected"];

  if (!allowedStatuses.includes(verificationStatus)) {
    throw new Error("Invalid worker verification status");
  }

  return await Worker.find({
    verificationStatus,
  })
    .populate("user", "name email phone language isVerified")
    .sort({ createdAt: -1 });
};

// ======================================
// UPDATE WORKER VERIFICATION STATUS
// ======================================

const updateWorkerVerificationStatus = async (
  workerId,
  verificationStatus
) => {
  const allowedStatuses = ["pending", "verified", "rejected"];

  if (!allowedStatuses.includes(verificationStatus)) {
    throw new Error("Invalid worker verification status");
  }

  const worker = await Worker.findById(workerId);

  if (!worker) {
    return null;
  }

  worker.verificationStatus = verificationStatus;

  // Rejected or pending workers should not be available for matching
  if (verificationStatus !== "verified") {
    worker.availability = false;
  }

  await worker.save();

  // Notify worker when verification is approved
  if (verificationStatus === "verified") {
    await createNotification({
      recipient: worker.user,
      type: "verification",
      title: "Worker Verification Approved",
      message:
        "Your worker profile has been verified. You can now receive service bookings.",
    });
  }

  // Notify worker when verification is rejected
  if (verificationStatus === "rejected") {
    await createNotification({
      recipient: worker.user,
      type: "verification",
      title: "Worker Verification Rejected",
      message:
        "Your worker profile verification was rejected. Please review your profile information and try again.",
    });
  }

  return await Worker.findById(worker._id).populate(
    "user",
    "name email phone language isVerified"
  );
};

module.exports = {
  getWorkersByStatus,
  updateWorkerVerificationStatus,
};