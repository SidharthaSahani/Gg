// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const { uploadDir } = require('./config/multer');

// Import routes
const tableRoutes = require('./routes/tableRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const menuRoutes = require('./routes/menuRoutes');
const carouselRoutes = require('./routes/carouselRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Table Booking API',
    version: '1.0.0',
    status: 'Running'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/carousel-images', carouselRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/upload-carousel', uploadRoutes); // For carousel uploads

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

module.exports = app;