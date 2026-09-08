const Welfare = require("../models/Welfare");

// Get all active welfare schemes
const getWelfareSchemes = async (req, res) => {
  try {
    const { category } = req.query;

    const query = {
      isActive: true,
    };

    if (category) {
      query.category = {
        $regex: new RegExp(category, "i"),
      };
    }

    const schemes = await Welfare.find(query).sort({
      category: 1,
      title: 1,
    });

    res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    console.error("Get welfare schemes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch welfare schemes",
      error: error.message,
    });
  }
};


// Get welfare scheme by ID
const getWelfareSchemeById = async (req, res) => {
  try {
    const scheme = await Welfare.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Welfare scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      scheme,
    });
  } catch (error) {
    console.error("Get welfare scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch welfare scheme",
      error: error.message,
    });
  }
};


// Create welfare scheme
const createWelfareScheme = async (req, res) => {
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

    const scheme = await Welfare.create({
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
      message: "Welfare scheme created successfully",
      scheme,
    });
  } catch (error) {
    console.error("Create welfare scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create welfare scheme",
      error: error.message,
    });
  }
};


// Update welfare scheme
const updateWelfareScheme = async (req, res) => {
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

    const scheme = await Welfare.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Welfare scheme not found",
      });
    }

    if (title !== undefined) scheme.title = title;
    if (description !== undefined) scheme.description = description;
    if (provider !== undefined) scheme.provider = provider;
    if (category !== undefined) scheme.category = category;
    if (benefits !== undefined) scheme.benefits = benefits;
    if (eligibility !== undefined) scheme.eligibility = eligibility;
    if (requiredDocuments !== undefined) {
      scheme.requiredDocuments = requiredDocuments;
    }
    if (applicationProcess !== undefined) {
      scheme.applicationProcess = applicationProcess;
    }
    if (applicationUrl !== undefined) {
      scheme.applicationUrl = applicationUrl;
    }
    if (isActive !== undefined) scheme.isActive = isActive;

    await scheme.save();

    res.status(200).json({
      success: true,
      message: "Welfare scheme updated successfully",
      scheme,
    });
  } catch (error) {
    console.error("Update welfare scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update welfare scheme",
      error: error.message,
    });
  }
};


// Deactivate welfare scheme
const deleteWelfareScheme = async (req, res) => {
  try {
    const scheme = await Welfare.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Welfare scheme not found",
      });
    }

    scheme.isActive = false;

    await scheme.save();

    res.status(200).json({
      success: true,
      message: "Welfare scheme deactivated successfully",
    });
  } catch (error) {
    console.error("Delete welfare scheme error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate welfare scheme",
      error: error.message,
    });
  }
};


module.exports = {
  getWelfareSchemes,
  getWelfareSchemeById,
  createWelfareScheme,
  updateWelfareScheme,
  deleteWelfareScheme,
};