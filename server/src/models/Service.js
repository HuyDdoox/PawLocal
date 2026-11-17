const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên dịch vụ là bắt buộc'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    basePrice: {
      type: Number,
      required: [true, 'Giá dịch vụ là bắt buộc'],
      min: 0,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    petTypes: [
      {
        type: String,
        enum: ['dog', 'cat', 'other'],
        default: ['dog'],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
