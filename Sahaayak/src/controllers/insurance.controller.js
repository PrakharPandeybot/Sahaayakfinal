const {
  getAllInsurancePlans,
  getInsurancePlanById: getInsurancePlanByIdService,
  createInsurancePlan: createInsurancePlanService,
  updateInsurancePlan: updateInsurancePlanService,
  deactivateInsurancePlan,
} = require("../services/insurance.service");

// ======================================
// GET ALL INSURANCE PLANS
// ======================================

const getInsurancePlans = async (req, res) => {
  try {
    const plans = await getAllInsurancePlans();

    res.status(200).json({
      success: true,
      count: plans.length,
      plans,
    });
  } catch (error) {
    console.error("Get insurance plans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch insurance plans",
      error: error.message,
    });
  }
};

// ======================================
// GET INSURANCE PLAN BY ID
// ======================================

const getInsurancePlanById = async (req, res) => {
  try {
    const plan = await getInsurancePlanByIdService(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Get insurance plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch insurance plan",
      error: error.message,
    });
  }
};

// ======================================
// CREATE INSURANCE PLAN
// ======================================

const createInsurancePlan = async (req, res) => {
  try {
    const {
      provider,
      planName,
      description,
      coverageAmount,
      premiumAmount,
      premiumFrequency,
      eligibility,
      benefits,
      documentsRequired,
      applicationUrl,
    } = req.body;

    if (
      !provider ||
      !planName ||
      !description ||
      coverageAmount === undefined ||
      premiumAmount === undefined ||
      !eligibility
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Provider, plan name, description, coverage amount, premium amount and eligibility are required",
      });
    }

    const plan = await createInsurancePlanService({
      provider,
      planName,
      description,
      coverageAmount,
      premiumAmount,
      premiumFrequency: premiumFrequency || "yearly",
      eligibility,
      benefits: benefits || [],
      documentsRequired: documentsRequired || [],
      applicationUrl: applicationUrl || "",
    });

    res.status(201).json({
      success: true,
      message: "Insurance plan created successfully",
      plan,
    });
  } catch (error) {
    console.error("Create insurance plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create insurance plan",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE INSURANCE PLAN
// ======================================

const updateInsurancePlan = async (req, res) => {
  try {
    const {
      provider,
      planName,
      description,
      coverageAmount,
      premiumAmount,
      premiumFrequency,
      eligibility,
      benefits,
      documentsRequired,
      applicationUrl,
      isActive,
    } = req.body;

    const plan = await updateInsurancePlanService(req.params.id, {
      provider,
      planName,
      description,
      coverageAmount,
      premiumAmount,
      premiumFrequency,
      eligibility,
      benefits,
      documentsRequired,
      applicationUrl,
      isActive,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Insurance plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("Update insurance plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update insurance plan",
      error: error.message,
    });
  }
};

// ======================================
// DEACTIVATE INSURANCE PLAN
// ======================================

const deleteInsurancePlan = async (req, res) => {
  try {
    const plan = await deactivateInsurancePlan(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Insurance plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Insurance plan deactivated successfully",
    });
  } catch (error) {
    console.error("Delete insurance plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate insurance plan",
      error: error.message,
    });
  }
};

module.exports = {
  getInsurancePlans,
  getInsurancePlanById,
  createInsurancePlan,
  updateInsurancePlan,
  deleteInsurancePlan,
};