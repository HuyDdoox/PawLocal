const Booking = require('../models/Booking');
const Pet = require('../models/Pet');
const Service = require('../models/Service');

const ALL_SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00'];

// @desc    Get available time slots for a service on a given date
// @route   GET /api/bookings/available-slots
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp serviceId và date',
      });
    }

    // Find active bookings on that day for that service
    const existingBookings = await Booking.find({
      service: serviceId,
      date,
      status: { $ne: 'cancelled' },
    });

    const bookedSlots = existingBookings.map((b) => b.timeSlot);
    const availableSlots = ALL_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    return res.status(200).json({
      success: true,
      data: {
        allSlots: ALL_SLOTS,
        bookedSlots,
        availableSlots,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi kiểm tra khung giờ trống',
    });
  }
};

// @desc    Create a new grooming booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { petId, serviceId, date, timeSlot, note } = req.body;

    if (!petId || !serviceId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn đầy đủ thú cưng, dịch vụ, ngày và khung giờ',
      });
    }

    if (!ALL_SLOTS.includes(timeSlot)) {
      return res.status(400).json({
        success: false,
        message: 'Khung giờ đã chọn không hợp lệ',
      });
    }

    // 1. Check pet ownership
    const pet = await Pet.findById(petId);
    if (!pet || pet.owner.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Thú cưng không tồn tại hoặc không thuộc quyền sở hữu của bạn',
      });
    }

    // 2. Check service
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Dịch vụ được chọn hiện không khả dụng',
      });
    }

    // 3. Check slot conflict
    const conflict = await Booking.findOne({
      service: serviceId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Khung giờ ${timeSlot} ngày ${date} đã có khách đặt. Vui lòng chọn khung giờ khác!`,
      });
    }

    // 4. Create booking
    const booking = await Booking.create({
      user: req.user._id,
      pet: pet._id,
      service: service._id,
      date,
      timeSlot,
      status: 'pending',
      price: service.basePrice,
      note: note ? note.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt lịch hẹn grooming thành công! Chúng tôi sẽ sớm xác nhận.',
      data: booking,
    });
  } catch (error) {
    console.error('[CreateBooking Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi đặt lịch',
    });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('pet', 'name species breed photo')
      .populate('service', 'name durationMinutes basePrice')
      .sort({ date: -1, timeSlot: -1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi tải lịch hẹn',
    });
  }
};

// @desc    Cancel a booking (Customer)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn',
      });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền hủy lịch hẹn này',
      });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Lịch hẹn đã ở trạng thái "${booking.status}", không thể hủy`,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Đã hủy lịch hẹn thành công',
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi hủy lịch hẹn',
    });
  }
};

module.exports = {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
};
