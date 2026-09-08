const Scheme = require("../models/Scheme");

// Get all active schemes
const getAllSchemes = async (category = null) => {
  const query = {
    isActive: true,
  };

  if (category) {
    query.category = {
      $regex: new RegExp(category, "i"),
    };
  }

  return await Scheme.find(query).sort({
    category: 1,
    title: 1,
  });
};

// Get one active scheme by ID
const getSchemeById = async (schemeId) => {
  return await Scheme.findOne({
    _id: schemeId,
    isActive: true,
  });
};

// Create a scheme
const createScheme = async (schemeData) => {
  return await Scheme.create(schemeData);
};

// Update a scheme
const updateScheme = async (schemeId, updateData) => {
  const scheme = await Scheme.findById(schemeId);

  if (!scheme) {
    return null;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      scheme[key] = updateData[key];
    }
  });

  await scheme.save();

  return scheme;
};

// Deactivate a scheme
const deactivateScheme = async (schemeId) => {
  const scheme = await Scheme.findById(schemeId);

  if (!scheme) {
    return null;
  }

  scheme.isActive = false;

  await scheme.save();

  return scheme;
};

module.exports = {
  getAllSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deactivateScheme,
};