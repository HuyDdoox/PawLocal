const Pet = require('../models/Pet');

// @desc    Get current user's pets
// @route   GET /api/pets
// @access  Private
const getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: pets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh sách thú cưng',
    });
  }
};

// @desc    Get pet by ID
// @route   GET /api/pets/:id
// @access  Private
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ thú cưng',
      });
    }

    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem hồ sơ thú cưng này',
      });
    }

    return res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải thông tin thú cưng',
    });
  }
};

// @desc    Create new pet profile
// @route   POST /api/pets
// @access  Private
const createPet = async (req, res) => {
  try {
    const { name, species, breed, birthDate, weightKg, notes, photo } = req.body;

    if (!name || !species) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên và loài thú cưng (chó/mèo)',
      });
    }

    const pet = await Pet.create({
      owner: req.user._id,
      name: name.trim(),
      species,
      breed: breed ? breed.trim() : '',
      birthDate: birthDate || null,
      weightKg: weightKg ? Number(weightKg) : 0,
      photo: photo || '/uploads/pets/default-pet.svg',
      notes: notes ? notes.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ thú cưng thành công',
      data: pet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo hồ sơ thú cưng',
    });
  }
};

// @desc    Update pet profile
// @route   PUT /api/pets/:id
// @access  Private
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ thú cưng để cập nhật',
      });
    }

    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền sửa hồ sơ này',
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thú cưng thành công',
      data: updatedPet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thú cưng',
    });
  }
};

// @desc    Delete pet profile
// @route   DELETE /api/pets/:id
// @access  Private
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ thú cưng để xóa',
      });
    }

    if (pet.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa thú cưng này',
      });
    }

    await Pet.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Đã xóa hồ sơ thú cưng',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa thú cưng',
    });
  }
};

module.exports = {
  getMyPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};
