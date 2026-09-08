const {
  enrollWorker,
  getWorkerTrainings,
  getWorkerTrainingById,
  updateTrainingStatus,
  cancelTrainingEnrollment,
} = require("../services/workerTraining.service");

// ======================================
// ENROLL IN TRAINING
// ======================================

const enrollInTraining = async (req, res) => {
  try {
    const enrollment = await enrollWorker(
      req.user._id,
      req.params.trainingId
    );

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in training program",
      enrollment,
    });
  } catch (error) {
    console.error("Training enrollment error:", error);

    const statusCode =
      error.message.includes("already enrolled") ||
      error.message.includes("not found")
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET MY TRAININGS
// ======================================

const getMyTrainings = async (req, res) => {
  try {
    const trainings = await getWorkerTrainings(req.user._id);

    res.status(200).json({
      success: true,
      count: trainings.length,
      trainings,
    });
  } catch (error) {
    console.error("Get worker trainings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your training programs",
      error: error.message,
    });
  }
};

// ======================================
// GET MY TRAINING BY ID
// ======================================

const getMyTraining = async (req, res) => {
  try {
    const training = await getWorkerTrainingById(
      req.user._id,
      req.params.id
    );

    if (!training) {
      return res.status(404).json({
        success: false,
        message: "Training enrollment not found",
      });
    }

    res.status(200).json({
      success: true,
      training,
    });
  } catch (error) {
    console.error("Get worker training error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch training enrollment",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE TRAINING STATUS
// ======================================

const updateMyTrainingStatus = async (req, res) => {
  try {
    const { status, certificateUrl } = req.body;

    const training = await updateTrainingStatus(
      req.user._id,
      req.params.id,
      status,
      certificateUrl
    );

    res.status(200).json({
      success: true,
      message: "Training status updated successfully",
      training,
    });
  } catch (error) {
    console.error("Update training status error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// CANCEL TRAINING
// ======================================

const cancelMyTraining = async (req, res) => {
  try {
    const training = await cancelTrainingEnrollment(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Training enrollment cancelled successfully",
      training,
    });
  } catch (error) {
    console.error("Cancel training enrollment error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  enrollInTraining,
  getMyTrainings,
  getMyTraining,
  updateMyTrainingStatus,
  cancelMyTraining,
};