const Banner = require('../models/Banner');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Service = require('../models/Service');

const getHomeData = async (req, res) => {
  try {
    const [banners, categories, services, allProducts] = await Promise.all([
      Banner.find().sort({ order: 1 }).limit(3),
      Category.find().sort({ order: 1 }),
      Service.find({ isActive: true }).limit(4),
      Product.find({ isAvailable: true }),
    ]);

    // 4 san pham hot
    const featuredProducts = allProducts.filter((p) => p.hot).slice(0, 4);

    // 4 san pham moi nhat
    const newProducts = [...allProducts]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 4);

    // 4 san pham giam gia sau
    const saleProducts = allProducts
      .filter((p) => (p.oldPrice || 0) > p.price)
      .sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice)
      .slice(0, 4);

    return res.status(200).json({
      success: true,
      banners,
      categories,
      featuredProducts: featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 4),
      saleProducts: saleProducts.length > 0 ? saleProducts : allProducts.slice(0, 4),
      newProducts,
      services,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Không thể tải dữ liệu trang chủ', details: error.message });
  }
};

module.exports = { getHomeData };
