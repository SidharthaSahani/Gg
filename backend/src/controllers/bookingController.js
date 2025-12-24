// src/controllers/bookingController.js
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError, sendCreated, formatDocuments, formatDocument } = require('../utils/responseHelper');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const db = getDatabase();
    const bookings = db.collection('bookings');
    const data = await bookings.find({}).sort({ created_at: -1 }).toArray();
    
    sendSuccess(res, formatDocuments(data));
  } catch (error) {
    sendError(res, error);
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const db = getDatabase();
    const bookings = db.collection('bookings');
    
    // Check for existing booking at same time slot
    const existingBooking = await bookings.findOne({
      table_id: req.body.table_id,
      booking_date: req.body.booking_date,
      booking_time: req.body.booking_time,
      status: { $ne: 'completed' }
    });
    
    if (existingBooking) {
      return res.status(409).json({ 
        success: false,
        error: 'This time slot is already booked for the selected table'
      });
    }
    
    // Create booking
    const result = await bookings.insertOne(req.body);
    const newBooking = await bookings.findOne({ _id: result.insertedId });
    
    sendCreated(res, formatDocument(newBooking), 'Booking created successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const db = getDatabase();
    const bookings = db.collection('bookings');
    
    await bookings.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    
    const updatedBooking = await bookings.findOne({ _id: new ObjectId(req.params.id) });
    
    sendSuccess(res, formatDocument(updatedBooking), 'Booking updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const db = getDatabase();
    const bookings = db.collection('bookings');
    
    const result = await bookings.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    sendSuccess(res, { deletedCount: result.deletedCount }, 'Booking deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Complete bookings by table ID
exports.completeBookingsByTableId = async (req, res) => {
  try {
    const db = getDatabase();
    const bookings = db.collection('bookings');
    const { status } = req.body;
    
    const result = await bookings.updateMany(
      { table_id: req.params.tableId, status: { $ne: 'completed' } },
      { $set: { status, completed_at: new Date().toISOString() } }
    );
    
    sendSuccess(res, { modifiedCount: result.modifiedCount }, 'Bookings updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Delete bookings by table ID (marks as completed)
exports.deleteBookingsByTableId = async (req, res) => {
  try {
    const db = getDatabase();
    const bookings = db.collection('bookings');
    
    const result = await bookings.updateMany(
      { table_id: req.params.tableId, status: { $ne: 'completed' } },
      { $set: { status: 'completed', completed_at: new Date().toISOString() } }
    );
    
    sendSuccess(res, { modifiedCount: result.modifiedCount }, 'Bookings completed successfully');
  } catch (error) {
    sendError(res, error);
  }
};