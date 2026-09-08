const {
  getRecommendedSchemes,
} = require("../services/schemeEligibility.service");

// ======================================
// GET RECOMMENDED GOVERNMENT SCHEMES
// ======================================

const getMyRecommendedSchemes = async (req, res) => {
  try {
    const recommendations = await getRecommendedSchemes(
      req.user._id
    );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error(
      "Get recommended schemes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch recommended schemes",
      error: error.message,
    });
  }
};

module.exports = {
  getMyRecommendedSchemes,
};