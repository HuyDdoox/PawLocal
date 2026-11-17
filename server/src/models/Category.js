const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: [true, 'Tên danh mục là bắt buộc'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'fa-solid fa-paw',
    },
    order: {
      type: Number,
      default: 0,
    },
    petType: {
      type: String,
      enum: ['dog', 'cat', 'all'],
      default: 'all',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
