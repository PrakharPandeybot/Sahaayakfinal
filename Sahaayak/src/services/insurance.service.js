const Insurance = require("../models/Insurance");

// Get all active insurance plans
const getAllInsurancePlans = async () => {
  return await Insurance.find({
    isActive: true,
  }).sort({
    provider: 1,
    planName: 1,
  });
};

// Get one active insurance plan by ID
const getInsurancePlanById = async (insuranceId) => {
  return await Insurance.findOne({
    _id: insuranceId,
    isActive: true,
  });
};

// Create an insurance plan
const createInsurancePlan = async (insuranceData) => {
  return await Insurance.create(insuranceData);
};

// Update an insurance plan
const updateInsurancePlan = async (insuranceId, updateData) => {
  const plan = await Insurance.findById(insuranceId);

  if (!plan) {
    return null;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      plan[key] = updateData[key];
    }
  });

  await plan.save();

  return plan;
};

// Deactivate an insurance plan
const deactivateInsurancePlan = async (insuranceId) => {
  const plan = await Insurance.findById(insuranceId);

  if (!plan) {
    return null;
  }

  plan.isActive = false;

  await plan.save();

  return plan;
};

module.exports = {
  getAllInsurancePlans,
  getInsurancePlanById,
  createInsurancePlan,
  updateInsurancePlan,
  deactivateInsurancePlan,
};