const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  confirmBookingPayment,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/available-slots', getAvailableSlots);
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/confirm-payment', protect, confirmBookingPayment);

module.exports = router;
