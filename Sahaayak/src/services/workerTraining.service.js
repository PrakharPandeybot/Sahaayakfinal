const WorkerTraining = require("../models/WorkerTraining");
const TrainingProgram = require("../models/TrainingProgram");
const User = require("../models/User");
const { createNotification } = require("./notification.service");

// ======================================
// ENROLL WORKER IN TRAINING
// ======================================

const enrollWorker = async (workerId, trainingProgramId) => {
  const program = await TrainingProgram.findOne({
    _id: trainingProgramId,
    isActive: true,
  });

  if (!program) {
    throw new Error("Training program not found or inactive");
  }

  const existingEnrollment = await WorkerTraining.findOne({
    workerId,
    trainingProgramId,
  });

  if (existingEnrollment) {
    throw new Error(
      "Worker is already enrolled in this training program"
    );
  }

  const enrollment = await WorkerTraining.create({
    workerId,
    trainingProgramId,
    status: "enrolled",
  });

  // Notify worker
  await createNotification({
    recipient: workerId,
    type: "welfare",
    title: "Training Enrollment Successful",
    message: `You have successfully enrolled in "${program.title}".`,
  });

  return enrollment;
};

// ======================================
// GET WORKER TRAININGS
// ======================================

const getWorkerTrainings = async (workerId) => {
  return WorkerTraining.find({ workerId })
    .populate(
      "trainingProgramId",
      "title description provider skills duration eligibility certification applicationUrl isFree"
    )
    .sort({ createdAt: -1 });
};

// ======================================
// GET ENROLLMENT BY ID
// ======================================

const getWorkerTrainingById = async (
  workerId,
  enrollmentId
) => {
  return WorkerTraining.findOne({
    _id: enrollmentId,
    workerId,
  }).populate(
    "trainingProgramId",
    "title description provider skills duration eligibility certification applicationUrl isFree"
  );
};

// ======================================
// UPDATE TRAINING STATUS
// ======================================

const updateTrainingStatus = async (
  workerId,
  enrollmentId,
  status,
  certificateUrl
) => {
  const enrollment = await WorkerTraining.findOne({
    _id: enrollmentId,
    workerId,
  }).populate("trainingProgramId");

  if (!enrollment) {
    throw new Error("Training enrollment not found");
  }

  const allowedStatuses = [
    "enrolled",
    "in-progress",
    "completed",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid training status");
  }

  const previousStatus = enrollment.status;

  // Prevent changing completed training
  if (
    previousStatus === "completed" &&
    status !== "completed"
  ) {
    throw new Error(
      "Completed training cannot be changed to another status"
    );
  }

  enrollment.status = status;

  // ======================================
  // TRAINING COMPLETED
  // ======================================

  if (
    status === "completed" &&
    previousStatus !== "completed"
  ) {
    enrollment.completedAt = new Date();

    if (certificateUrl) {
      enrollment.certificateUrl = certificateUrl;
    }

    const worker = await User.findById(workerId);

    if (!worker) {
      throw new Error("Worker not found");
    }

    const program = enrollment.trainingProgramId;

    // --------------------------------------
    // ADD TRAINING SKILLS TO WORKER
    // --------------------------------------

    if (Array.isArray(program.skills)) {
      const existingSkills = Array.isArray(worker.skills)
        ? worker.skills
        : [];

      const normalizedExistingSkills =
        existingSkills.map((skill) =>
          skill.trim().toLowerCase()
        );

      for (const skill of program.skills) {
        const normalizedSkill = skill
          .trim()
          .toLowerCase();

        if (
          normalizedSkill &&
          !normalizedExistingSkills.includes(
            normalizedSkill
          )
        ) {
          existingSkills.push(skill.trim());
          normalizedExistingSkills.push(normalizedSkill);
        }
      }

      worker.skills = existingSkills;
    }

    // --------------------------------------
    // ADD CERTIFICATION
    // --------------------------------------

    if (program.certification) {
      const existingCertifications =
        Array.isArray(worker.certifications)
          ? worker.certifications
          : [];

      const certificationExists =
        existingCertifications.some(
          (certification) =>
            certification.name &&
            certification.name.trim().toLowerCase() ===
              program.certification
                .trim()
                .toLowerCase()
        );

      if (!certificationExists) {
        existingCertifications.push({
          name: program.certification.trim(),
          issuer: program.provider || "",
          issuedAt: new Date(),
          certificateUrl: certificateUrl || "",
        });
      }

      worker.certifications = existingCertifications;
    }

    await worker.save();

    // --------------------------------------
    // TRAINING COMPLETION NOTIFICATION
    // --------------------------------------

    await createNotification({
      recipient: workerId,
      type: "welfare",
      title: "Training Completed",
      message: `Congratulations! You completed "${program.title}". Your worker profile has been updated with the new skills and certification.`,
    });
  } else if (
    status === "completed" &&
    certificateUrl &&
    !enrollment.certificateUrl
  ) {
    enrollment.certificateUrl = certificateUrl;
  }

  await enrollment.save();

  return enrollment.populate(
    "trainingProgramId",
    "title description provider skills duration eligibility certification applicationUrl isFree"
  );
};

// ======================================
// CANCEL TRAINING
// ======================================

const cancelTrainingEnrollment = async (
  workerId,
  enrollmentId
) => {
  const enrollment = await WorkerTraining.findOne({
    _id: enrollmentId,
    workerId,
  });

  if (!enrollment) {
    throw new Error("Training enrollment not found");
  }

  if (enrollment.status === "completed") {
    throw new Error(
      "Completed training cannot be cancelled"
    );
  }

  enrollment.status = "cancelled";

  await enrollment.save();

  return enrollment;
};

module.exports = {
  enrollWorker,
  getWorkerTrainings,
  getWorkerTrainingById,
  updateTrainingStatus,
  cancelTrainingEnrollment,
};