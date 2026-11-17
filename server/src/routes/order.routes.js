const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  confirmOrderPayment,
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/confirm-payment', protect, confirmOrderPayment);

module.exports = router;
