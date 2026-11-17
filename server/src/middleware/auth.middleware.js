const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - requires valid JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản không còn tồn tại trong hệ thống',
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Protect Error]', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để thực hiện chức năng này',
    });
  }
};

// Restrict to Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Quyền truy cập bị từ chối: Chỉ quản trị viên mới được phép',
  });
};

module.exports = { protect, adminOnly };
