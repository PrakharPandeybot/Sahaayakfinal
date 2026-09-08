const {
  getActiveTrainingPrograms,
  getTrainingProgramById,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
} = require("../services/training.service");

// ======================================
// GET ALL TRAINING PROGRAMS
// ======================================

const getTrainingPrograms = async (req, res) => {
  try {
    const programs = await getActiveTrainingPrograms();

    res.status(200).json({
      success: true,
      count: programs.length,
      programs,
    });
  } catch (error) {
    console.error("Get training programs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch training programs",
      error: error.message,
    });
  }
};

// ======================================
// GET TRAINING PROGRAM BY ID
// ======================================

const getTrainingProgram = async (req, res) => {
  try {
    const program = await getTrainingProgramById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Training program not found",
      });
    }

    res.status(200).json({
      success: true,
      program,
    });
  } catch (error) {
    console.error("Get training program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch training program",
      error: error.message,
    });
  }
};

// ======================================
// CREATE TRAINING PROGRAM - ADMIN
// ======================================

const createTraining = async (req, res) => {
  try {
    const {
      title,
      description,
      provider,
      skills,
      duration,
      eligibility,
      certification,
      applicationUrl,
      isFree,
    } = req.body;

    if (
      !title ||
      !description ||
      !provider ||
      !duration ||
      !eligibility
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, provider, duration and eligibility are required",
      });
    }

    const program = await createTrainingProgram({
      title,
      description,
      provider,
      skills: Array.isArray(skills) ? skills : [],
      duration,
      eligibility,
      certification: certification || "",
      applicationUrl: applicationUrl || "",
      isFree: isFree !== undefined ? isFree : true,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Training program created successfully",
      program,
    });
  } catch (error) {
    console.error("Create training program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create training program",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE TRAINING PROGRAM - ADMIN
// ======================================

const updateTraining = async (req, res) => {
  try {
    const program = await updateTrainingProgram(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Training program updated successfully",
      program,
    });
  } catch (error) {
    console.error("Update training program error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE TRAINING PROGRAM - ADMIN
// ======================================

const deleteTraining = async (req, res) => {
  try {
    await deleteTrainingProgram(req.params.id);

    res.status(200).json({
      success: true,
      message: "Training program removed successfully",
    });
  } catch (error) {
    console.error("Delete training program error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTrainingPrograms,
  getTrainingProgram,
  createTraining,
  updateTraining,
  deleteTraining,
};