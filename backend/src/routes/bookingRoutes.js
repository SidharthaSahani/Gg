// src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const bookingController = require('../controllers/bookingController');

// Public route for customers to create bookings
router.get('/', asyncHandler(bookingController.getAllBookings));
router.post('/', asyncHandler(bookingController.createBooking));

// Admin routes require authentication
router.put('/:id', adminAuth, asyncHandler(bookingController.updateBooking));
router.delete('/:id', adminAuth, asyncHandler(bookingController.deleteBooking));

// Table-specific admin routes
router.put('/table/:tableId', adminAuth, asyncHandler(bookingController.completeBookingsByTableId));
router.delete('/table/:tableId', adminAuth, asyncHandler(bookingController.deleteBookingsByTableId));

module.exports = router;