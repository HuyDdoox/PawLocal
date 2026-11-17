const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    image: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    author: { type: String, default: 'PawLocal Doctor' },
    date: { type: String, default: '15/11/2026' },
    views: { type: Number, default: 120 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
