const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filters, search, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, categorySlug, categoryId, petType, search, minPrice, maxPrice, page = 1, limit = 20, sort } = req.query;

    const query = { isAvailable: true };

    // Filter by petType
    if (petType && petType !== 'all') {
      query.petTypes = petType;
    }

    // Filter by categorySlug
    if (categorySlug && categorySlug !== 'tat-ca') {
      query.categorySlug = categorySlug;
    }

    // Filter by categoryId
    if (categoryId && Number(categoryId) > 0) {
      query.categoryId = Number(categoryId);
    }

    // Filter by category (could be slug or ObjectId)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search keyword
    if (search && search.trim()) {
      const keyword = search.trim();
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug petType')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error('[GetProducts Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh sách sản phẩm',
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug petType icon');
    } else if (!isNaN(Number(id))) {
      product = await Product.findOne({ id: Number(id) }).populate('category', 'name slug petType icon');
    } else {
      product = await Product.findOne({ slug: id }).populate('category', 'name slug petType icon');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm yêu cầu',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải thông tin sản phẩm',
    });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, petTypes, image, isAvailable } = req.body;

    if (!name || price === undefined || stock === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ tên, giá, số lượng tồn kho và danh mục',
      });
    }

    const product = await Product.create({
      name,
      description: description || '',
      price: Number(price),
      stock: Number(stock),
      category,
      petTypes: petTypes || ['dog'],
      image: image || '/uploads/products/default-product.svg',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo sản phẩm',
    });
  }
};

// @desc    Update product (Admin)
// @route   PATCH /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm để cập nhật',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật sản phẩm',
    });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm để xóa',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa sản phẩm',
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
