const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Product = require('../models/Product');

// @desc    Get all orders for admin with filter
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAdminOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh sách đơn hàng quản trị',
    });
  }
};

// @desc    Update order status and/or payment status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
    const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];

    const updateData = {};
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái đơn hàng không hợp lệ',
        });
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái thanh toán không hợp lệ',
        });
      }
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') {
        updateData['paymentDetails.paidAt'] = new Date();
      }
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Cập nhật trạng thái đơn hàng thành công`,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái đơn hàng',
    });
  }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Private (Admin)
const getAdminBookings = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (date) filter.date = date;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('pet', 'name species breed weightKg')
      .populate('service', 'name durationMinutes basePrice')
      .sort({ date: -1, timeSlot: 1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh sách lịch hẹn quản trị',
    });
  }
};

// @desc    Update booking status and/or payment status
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const validPaymentStatuses = ['unpaid', 'paid', 'refunded'];

    const updateData = {};
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái lịch hẹn không hợp lệ',
        });
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái thanh toán không hợp lệ',
        });
      }
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') {
        updateData['paymentDetails.paidAt'] = new Date();
      }
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
      .populate('user', 'name email phone')
      .populate('pet', 'name species breed')
      .populate('service', 'name durationMinutes basePrice');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Cập nhật trạng thái lịch hẹn thành công`,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật lịch hẹn',
    });
  }
};

// @desc    Toggle product availability
// @route   PATCH /api/admin/products/:id/toggle
// @access  Private (Admin)
const toggleProductAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Sản phẩm hiện đang ${product.isAvailable ? 'MỞ BÁN' : 'TẠM ẨN'}`,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi đổi trạng thái sản phẩm',
    });
  }
};

// @desc    Get dashboard statistics (Revenue, Pending Orders, Today Bookings, Low Stock)
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      revenueResult,
      pendingOrdersCount,
      todayBookingsCount,
      lowStockProductsCount,
      recentOrders,
      recentBookings,
    ] = await Promise.all([
      // Total Revenue from completed orders
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
      // Pending orders
      Order.countDocuments({ status: 'pending' }),
      // Today bookings (active)
      Booking.countDocuments({ date: today, status: { $ne: 'cancelled' } }),
      // Low stock products
      Product.countDocuments({ stock: { $lte: 5 }, isAvailable: true }),
      // Recent 5 orders
      Order.find()
        .populate('user', 'name phone email')
        .sort({ createdAt: -1 })
        .limit(5),
      // Recent 5 bookings
      Booking.find()
        .populate('user', 'name phone')
        .populate('pet', 'name species')
        .populate('service', 'name durationMinutes basePrice')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      data: {
        revenue,
        pendingOrdersCount,
        todayBookingsCount,
        lowStockProductsCount,
        recentOrders,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('[AdminStats Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải dữ liệu thống kê',
    });
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private (Admin)
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh sách sản phẩm quản trị',
    });
  }
};

module.exports = {
  getAdminOrders,
  updateOrderStatus,
  getAdminBookings,
  updateBookingStatus,
  getAdminProducts,
  toggleProductAvailability,
  getAdminStats,
};
