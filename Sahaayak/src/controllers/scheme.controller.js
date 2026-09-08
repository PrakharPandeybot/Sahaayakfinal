const {
  getAllSchemes,
  getSchemeById: getSchemeByIdService,
  createScheme: createSchemeService,
  updateScheme: updateSchemeService,
  deactivateScheme,
} = require("../services/scheme.service");

// Get all active schemes
const getSchemes = async (req, res) => {
  try {
    const { category } = req.query;

    const schemes = await getAllSchemes(category);

    res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    console.error("Get schemes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch schemes",
      error: error.message,
    });
  }
};

// Get scheme by ID
const getSchemeById = async (req, res) => {
  try {
    const scheme = await getSchemeByIdService(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      scheme,
    });
  } catch (error) {
    console.error("Get scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scheme",
      error: error.message,
    });
  }
};

// Create scheme
const createScheme = async (req, res) => {
  try {
    const {
      title,
      description,
      provider,
      category,
      benefits,
      eligibility,
      requiredDocuments,
      applicationProcess,
      applicationUrl,
    } = req.body;

    if (
      !title ||
      !description ||
      !provider ||
      !category ||
      !benefits ||
      !eligibility ||
      !applicationProcess
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, provider, category, benefits, eligibility and application process are required",
      });
    }

    const scheme = await createSchemeService({
      title,
      description,
      provider,
      category,
      benefits,
      eligibility,
      requiredDocuments: requiredDocuments || [],
      applicationProcess,
      applicationUrl: applicationUrl || "",
    });

    res.status(201).json({
      success: true,
      message: "Scheme created successfully",
      scheme,
    });
  } catch (error) {
    console.error("Create scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create scheme",
      error: error.message,
    });
  }
};

// Update scheme
const updateScheme = async (req, res) => {
  try {
    const {
      title,
      description,
      provider,
      category,
      benefits,
      eligibility,
      requiredDocuments,
      applicationProcess,
      applicationUrl,
      isActive,
    } = req.body;

    const updateData = {
      title,
      description,
      provider,
      category,
      benefits,
      eligibility,
      requiredDocuments,
      applicationProcess,
      applicationUrl,
      isActive,
    };

    const scheme = await updateSchemeService(
      req.params.id,
      updateData
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scheme updated successfully",
      scheme,
    });
  } catch (error) {
    console.error("Update scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update scheme",
      error: error.message,
    });
  }
};

// Deactivate scheme
const deleteScheme = async (req, res) => {
  try {
    const scheme = await deactivateScheme(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scheme deactivated successfully",
    });
  } catch (error) {
    console.error("Delete scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate scheme",
      error: error.message,
    });
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
};