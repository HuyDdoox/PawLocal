const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new COD order
// @route   POST /api/orders
// @access  Private (Customer/Admin)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng của bạn đang trống',
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.recipientName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ tên người nhận, số điện thoại và địa chỉ giao hàng',
      });
    }

    const orderItems = [];
    let subtotal = 0;

    // Validate each item and stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${item.name || 'đã chọn'}" hiện không còn kinh doanh`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm trong kho (bạn đặt ${item.quantity})`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // Delivery fee: 0 if subtotal >= 300,000 VND, else 20,000 VND
    const deliveryFee = subtotal >= 300000 ? 0 : 20000;
    const total = subtotal + deliveryFee;

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      paymentMethod: 'COD',
      shippingAddress: {
        recipientName: shippingAddress.recipientName.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        note: shippingAddress.note ? shippingAddress.note.trim() : '',
      },
    });

    // Deduct stock for each product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công! Đơn hàng đang được chuẩn bị.',
      data: order,
    });
  } catch (error) {
    console.error('[CreateOrder Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi xử lý đơn hàng',
    });
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải danh sách đơn hàng',
    });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin đơn hàng',
      });
    }

    // Only owner or admin can view
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem đơn hàng này',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy chi tiết đơn hàng',
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
