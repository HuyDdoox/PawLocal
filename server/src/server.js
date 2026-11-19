const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables (from server folder or root)
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// CORS configuration
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:4200'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev
    },
    credentials: true,
  })
);

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure DB connection before processing request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[DB Middleware Error]', err.message);
  }
  next();
});

// Health Check Endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'PawLocal API is running smoothly',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
const docsRoutes = require('./routes/docs.routes');
const homeRoutes = require('./routes/home.routes');
const blogRoutes = require('./routes/blog.routes');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const petRoutes = require('./routes/pet.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');

// Helper to support both with and without /api prefix
const mountRoute = (prefix, handler) => {
  app.use(`/api${prefix}`, handler);
  app.use(prefix, handler);
};

mountRoute('/docs', docsRoutes);
app.get(['/', '/api', '/docs'], (req, res) => res.redirect('/api/docs'));
mountRoute('/home', homeRoutes);
mountRoute('/blogs', blogRoutes);
mountRoute('/auth', authRoutes);
mountRoute('/categories', categoryRoutes);
mountRoute('/products', productRoutes);
mountRoute('/orders', orderRoutes);
mountRoute('/pets', petRoutes);
mountRoute('/services', serviceRoutes);
mountRoute('/bookings', bookingRoutes);
mountRoute('/admin', adminRoutes);

// Fallback 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Server] PawLocal API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
