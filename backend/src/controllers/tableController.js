// src/controllers/tableController.js
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError, sendCreated, formatDocuments, formatDocument } = require('../utils/responseHelper');

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const db = getDatabase();
    const tables = db.collection('restaurant_tables');
    const data = await tables.find({}).sort({ table_number: 1 }).toArray();
    
    sendSuccess(res, formatDocuments(data));
  } catch (error) {
    sendError(res, error);
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const db = getDatabase();
    const tables = db.collection('restaurant_tables');
    
    // Check if table number already exists
    const existingTable = await tables.findOne({ table_number: req.body.table_number });
    if (existingTable) {
      return res.status(409).json({ 
        success: false,
        error: 'A table with this number already exists' 
      });
    }
    
    // Insert new table
    const result = await tables.insertOne(req.body);
    const newTable = await tables.findOne({ _id: result.insertedId });
    
    sendCreated(res, formatDocument(newTable), 'Table created successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Update a table
exports.updateTable = async (req, res) => {
  try {
    const db = getDatabase();
    const tables = db.collection('restaurant_tables');
    
    await tables.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    
    const updatedTable = await tables.findOne({ _id: new ObjectId(req.params.id) });
    
    sendSuccess(res, formatDocument(updatedTable), 'Table updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const db = getDatabase();
    const tables = db.collection('restaurant_tables');
    
    const result = await tables.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }
    
    sendSuccess(res, { deletedCount: result.deletedCount }, 'Table deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
};