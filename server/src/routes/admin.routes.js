const express = require('express');
const router = express.Router();
const {
  getAdminOrders,
  updateOrderStatus,
  getAdminBookings,
  updateBookingStatus,
  getAdminProducts,
  toggleProductAvailability,
  getAdminStats,
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Protect all admin routes
router.use(protect, adminOnly);

// Dashboard KPI Stats
router.get('/stats', getAdminStats);

// Order Management
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Booking Management
router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// Product Management
router.get('/products', getAdminProducts);
router.patch('/products/:id/toggle', toggleProductAvailability);

module.exports = router;
