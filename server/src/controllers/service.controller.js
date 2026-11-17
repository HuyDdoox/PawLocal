const Service = require('../models/Service');

// @desc    Get all active grooming services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { petType } = req.query;
    const filter = { isActive: true };

    if (petType && petType !== 'all') {
      filter.petTypes = petType;
    }

    const services = await Service.find(filter).sort({ basePrice: 1 });
    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh sách dịch vụ',
    });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ',
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải thông tin dịch vụ',
    });
  }
};

// @desc    Create service (Admin)
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res) => {
  try {
    const { name, description, basePrice, durationMinutes, petTypes, isActive } = req.body;

    if (!name || basePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên và giá dịch vụ',
      });
    }

    const service = await Service.create({
      name,
      description: description || '',
      basePrice: Number(basePrice),
      durationMinutes: durationMinutes ? Number(durationMinutes) : 60,
      petTypes: petTypes || ['dog'],
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo dịch vụ thành công',
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo dịch vụ',
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
};
