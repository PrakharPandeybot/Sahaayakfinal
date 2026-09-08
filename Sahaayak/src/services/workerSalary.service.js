const WorkerSalary = require("../models/WorkerSalary");

/**
 * Get the current month's salary record for a worker.
 * Creates one automatically if it does not exist.
 */
const getOrCreateCurrentSalary = async (workerId) => {
  const now = new Date();

  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let salary = await WorkerSalary.findOne({
    workerId,
    month,
    year,
  });

  if (!salary) {
    salary = await WorkerSalary.create({
      workerId,
      month,
      year,
      baseSalary: 10000,
      monthlyJobLimit: 40,
      overtimeRate: 300,
      completedJobs: 0,
      extraJobs: 0,
      overtimePay: 0,
      performanceBonus: 0,
      adjustment: 0,
      finalSalary: 10000,
    });
  }

  return salary;
};

/**
 * Update completed jobs and calculate overtime.
 */
const updateWorkerJobCount = async (workerId) => {
  const salary = await getOrCreateCurrentSalary(workerId);

  const completedJobs = salary.completedJobs + 1;

  const extraJobs = Math.max(
    0,
    completedJobs - salary.monthlyJobLimit
  );

  const overtimePay = extraJobs * salary.overtimeRate;

  const finalSalary =
    salary.baseSalary +
    overtimePay +
    salary.performanceBonus +
    salary.adjustment;

  salary.completedJobs = completedJobs;
  salary.extraJobs = extraJobs;
  salary.overtimePay = overtimePay;
  salary.finalSalary = Math.max(0, finalSalary);

  await salary.save();

  return salary;
};

/**
 * Recalculate salary.
 */
const recalculateSalary = async (salaryId) => {
  const salary = await WorkerSalary.findById(salaryId);

  if (!salary) {
    throw new Error("Salary record not found");
  }

  salary.extraJobs = Math.max(
    0,
    salary.completedJobs - salary.monthlyJobLimit
  );

  salary.overtimePay =
    salary.extraJobs * salary.overtimeRate;

  salary.finalSalary = Math.max(
    0,
    salary.baseSalary +
      salary.overtimePay +
      salary.performanceBonus +
      salary.adjustment
  );

  salary.status = "calculated";

  await salary.save();

  return salary;
};

/**
 * Get salary history for a worker.
 */
const getWorkerSalaryHistory = async (workerId) => {
  return WorkerSalary.find({ workerId })
    .sort({ year: -1, month: -1 });
};

/**
 * Get current salary for a worker.
 */
const getCurrentWorkerSalary = async (workerId) => {
  return getOrCreateCurrentSalary(workerId);
};

/**
 * Get all salary records.
 */
const getAllWorkerSalaries = async () => {
  return WorkerSalary.find()
    .populate("workerId")
    .sort({ year: -1, month: -1 });
};

/**
 * Mark salary as paid.
 */
const markSalaryAsPaid = async (salaryId) => {
  const salary = await WorkerSalary.findById(salaryId);

  if (!salary) {
    throw new Error("Salary record not found");
  }

  salary.status = "paid";
  salary.paidAt = new Date();

  await salary.save();

  return salary;
};

module.exports = {
  getOrCreateCurrentSalary,
  updateWorkerJobCount,
  recalculateSalary,
  getWorkerSalaryHistory,
  getCurrentWorkerSalary,
  getAllWorkerSalaries,
  markSalaryAsPaid,
};