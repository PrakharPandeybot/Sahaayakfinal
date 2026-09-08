const {
  getUserProfile,
  updateUserProfile,
} = require("../services/user.service");

// ======================================
// GET MY PROFILE
// ======================================

const getMyProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE MY PROFILE
// ======================================

const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, language } = req.body;

    const user = await updateUserProfile(req.user._id, {
      name,
      phone,
      language,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};