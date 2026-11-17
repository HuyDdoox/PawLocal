const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Tên thú cưng là bắt buộc'],
      trim: true,
    },
    species: {
      type: String,
      enum: ['dog', 'cat', 'other'],
      default: 'dog',
      required: true,
    },
    breed: {
      type: String,
      default: '',
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    weightKg: {
      type: Number,
      min: [0, 'Cân nặng không thể âm'],
      default: 0,
    },
    photo: {
      type: String,
      default: '/uploads/pets/default-pet.svg',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

petSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Pet', petSchema);
