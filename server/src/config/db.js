const mongoose = require('mongoose');

const DEFAULT_ATLAS_URI = 'mongodb+srv://huyqddoox:logmzJUY0tMjd8WR@cluster0.szpkerr.mongodb.net/pawlocal?retryWrites=true&w=majority';

let isConnecting = false;

const connectDB = async () => {
  // If already connected, reuse connection (Serverless pattern)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (isConnecting) return;
  isConnecting = true;

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    console.error(`[Database Error] Không thể kết nối tới MongoDB:`, error.message);
    isConnecting = false;
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
