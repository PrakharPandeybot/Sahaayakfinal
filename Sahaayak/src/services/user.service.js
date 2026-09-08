const User = require("../models/User");

// Get user profile
const getUserProfile = async (userId) => {
  return await User.findById(userId).select(
    "-password -__v"
  );
};

// Update user profile
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  const allowedFields = [
    "name",
    "phone",
    "language",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();

  return await User.findById(user._id).select(
    "-password -__v"
  );
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};