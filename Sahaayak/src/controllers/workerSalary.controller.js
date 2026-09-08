const {
  getCurrentWorkerSalary,
  getWorkerSalaryHistory,
  getAllWorkerSalaries,
  recalculateSalary,
  markSalaryAsPaid,
} = require("../services/workerSalary.service");

// ======================================
// GET CURRENT WORKER SALARY
// ======================================

const getMyCurrentSalary = async (req, res) => {
  try {
    const salary = await getCurrentWorkerSalary(req.user._id);

    res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    console.error("Get current salary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current salary",
      error: error.message,
    });
  }
};

// ======================================
// GET WORKER SALARY HISTORY
// ======================================

const getMySalaryHistory = async (req, res) => {
  try {
    const salaries = await getWorkerSalaryHistory(req.user._id);

    res.status(200).json({
      success: true,
      count: salaries.length,
      salaries,
    });
  } catch (error) {
    console.error("Get salary history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch salary history",
      error: error.message,
    });
  }
};

// ======================================
// ADMIN - GET ALL SALARIES
// ======================================

const getAllSalaries = async (req, res) => {
  try {
    const salaries = await getAllWorkerSalaries();

    res.status(200).json({
      success: true,
      count: salaries.length,
      salaries,
    });
  } catch (error) {
    console.error("Get all salaries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker salaries",
      error: error.message,
    });
  }
};

// ======================================
// ADMIN - RECALCULATE SALARY
// ======================================

const recalculateWorkerSalary = async (req, res) => {
  try {
    const salary = await recalculateSalary(req.params.id);

    res.status(200).json({
      success: true,
      message: "Worker salary recalculated successfully",
      salary,
    });
  } catch (error) {
    console.error("Recalculate salary error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ADMIN - MARK SALARY AS PAID
// ======================================

const markWorkerSalaryAsPaid = async (req, res) => {
  try {
    const salary = await markSalaryAsPaid(req.params.id);

    res.status(200).json({
      success: true,
      message: "Worker salary marked as paid",
      salary,
    });
  } catch (error) {
    console.error("Mark salary paid error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyCurrentSalary,
  getMySalaryHistory,
  getAllSalaries,
  recalculateWorkerSalary,
  markWorkerSalaryAsPaid,
};