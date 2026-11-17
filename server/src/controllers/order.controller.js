const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateOrderQr } = require('../utils/vietqr');

// @desc    Create a new order (COD or VietQR)
// @route   POST /api/orders
// @access  Private (Customer/Admin)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const selectedMethod = paymentMethod === 'VIETQR' ? 'VIETQR' : 'COD';

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
      paymentMethod: selectedMethod,
      paymentStatus: 'unpaid',
      paymentDetails: {
        qrUrl: selectedMethod === 'VIETQR' ? generateOrderQr('temp', total) : '',
        transferNote: '',
      },
      shippingAddress: {
        recipientName: shippingAddress.recipientName.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        note: shippingAddress.note ? shippingAddress.note.trim() : '',
      },
    });

    // Update real QR with order._id
    if (selectedMethod === 'VIETQR') {
      order.paymentDetails.qrUrl = generateOrderQr(order._id, total);
      order.paymentDetails.transferNote = `PAWLOCAL DH ${String(order._id).slice(-6).toUpperCase()}`;
      await order.save();
    }

    // Deduct stock for each product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return res.status(201).json({
      success: true,
      message:
        selectedMethod === 'VIETQR'
          ? 'Đặt hàng thành công! Vui lòng quét mã VietQR để thanh toán.'
          : 'Đặt hàng thành công! Đơn hàng đang được chuẩn bị.',
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

// @desc    Confirm customer payment for an order
// @route   PATCH /api/orders/:id/confirm-payment
// @access  Private
const confirmOrderPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin đơn hàng',
      });
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật đơn hàng này',
      });
    }

    order.paymentStatus = 'paid';
    if (order.status === 'pending') {
      order.status = 'processing';
    }
    order.paymentDetails.paidAt = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Xác nhận thanh toán thành công! Đơn hàng đang được chuẩn bị để giao.',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thanh toán đơn hàng',
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  confirmOrderPayment,
};
