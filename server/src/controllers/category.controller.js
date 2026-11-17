const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const { petType } = req.query;
    const filter = {};
    if (petType) {
      filter.$or = [{ petType }, { petType: 'all' }];
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh mục',
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, petType } = req.body;
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Tên và slug danh mục là bắt buộc',
      });
    }

    const category = await Category.create({ name, slug, petType });
    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo danh mục',
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
