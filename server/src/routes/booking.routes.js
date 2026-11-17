const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/available-slots', getAvailableSlots);
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
