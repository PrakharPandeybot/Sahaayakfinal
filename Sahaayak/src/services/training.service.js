const TrainingProgram = require("../models/TrainingProgram");

// ======================================
// GET ALL ACTIVE TRAINING PROGRAMS
// ======================================

const getActiveTrainingPrograms = async () => {
  return TrainingProgram.find({
    isActive: true,
  }).sort({ createdAt: -1 });
};

// ======================================
// GET TRAINING PROGRAM BY ID
// ======================================

const getTrainingProgramById = async (trainingId) => {
  return TrainingProgram.findOne({
    _id: trainingId,
    isActive: true,
  });
};

// ======================================
// CREATE TRAINING PROGRAM
// ======================================

const createTrainingProgram = async (data) => {
  return TrainingProgram.create(data);
};

// ======================================
// UPDATE TRAINING PROGRAM
// ======================================

const updateTrainingProgram = async (trainingId, data) => {
  const training = await TrainingProgram.findByIdAndUpdate(
    trainingId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!training) {
    throw new Error("Training program not found");
  }

  return training;
};

// ======================================
// DELETE TRAINING PROGRAM
// ======================================

const deleteTrainingProgram = async (trainingId) => {
  const training = await TrainingProgram.findByIdAndUpdate(
    trainingId,
    { isActive: false },
    { new: true }
  );

  if (!training) {
    throw new Error("Training program not found");
  }

  return training;
};

module.exports = {
  getActiveTrainingPrograms,
  getTrainingProgramById,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
};