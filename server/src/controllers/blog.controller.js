const Blog = require('../models/Blog');

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ id: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Không thể tải danh sách bài viết' });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let blog;
    if (!isNaN(Number(slug))) {
      blog = await Blog.findOne({ id: Number(slug) });
    } else {
      blog = await Blog.findOne({ slug });
    }
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Lỗi server' });
  }
};

module.exports = { getBlogs, getBlogBySlug };
