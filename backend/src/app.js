// ============================================
// FILE 1: backend/src/app.js (UPDATED)
// ============================================
const express = require('express');
const cors = require('cors');
const path = require('path');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import routes
const tableRoutes = require('./routes/tableRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const menuRoutes = require('./routes/menuRoutes');
const carouselRoutes = require('./routes/carouselRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Mount routes with /api prefix
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/carousel-images', carouselRoutes);
app.use('/api/upload', uploadRoutes);  // ✅ This makes it /api/upload

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler (should be last)
app.use(errorHandler);

module.exports = app;
