// src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const bookingController = require('../controllers/bookingController');

router.get('/', asyncHandler(bookingController.getAllBookings));
router.post('/', asyncHandler(bookingController.createBooking));
router.put('/:id', asyncHandler(bookingController.updateBooking));
router.delete('/:id', asyncHandler(bookingController.deleteBooking));

// Table-specific routes
router.put('/table/:tableId', asyncHandler(bookingController.completeBookingsByTableId));
router.delete('/table/:tableId', asyncHandler(bookingController.deleteBookingsByTableId));

module.exports = router;