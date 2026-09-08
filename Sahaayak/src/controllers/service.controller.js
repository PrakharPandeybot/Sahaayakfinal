const Service = require("../models/Service");

// GET /api/services
// Get all active services
const getServices = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

// GET /api/services/:id
// Get one service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

// POST /api/services
// Create service
const createService = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      basePrice,
      estimatedDuration,
    } = req.body;

    if (
      !name ||
      !category ||
      basePrice === undefined ||
      estimatedDuration === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "name, category, basePrice and estimatedDuration are required",
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      basePrice,
      estimatedDuration,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

// PUT /api/services/:id
// Update service
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

// DELETE /api/services/:id
// Soft delete service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deactivated successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate service",
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};