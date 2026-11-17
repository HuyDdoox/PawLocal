const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pawlocal';
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed mock data if database is empty (Chuẩn Lab 4 / Asm 1)
    const Product = require('../models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Database] Database is empty. Auto-seeding mock data to MongoDB...');
      const seedAll = require('../utils/seedAll');
      await seedAll(false);
      console.log('[Database] Auto-seed to MongoDB completed!');
    }
  } catch (error) {
    console.error(`[Database Error] Không thể kết nối tới MongoDB (${uri}):`, error.message);
    console.error('👉 Gợi ý: Hãy đảm bảo service MongoDB đang chạy (Start-Service MongoDB) hoặc kiểm tra chuỗi kết nối trong .env');
    process.exit(1);
  }
};

module.exports = connectDB;
