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
    
    // Format all tables to match frontend expectations
    const formattedData = data.map(table => ({
      id: table._id.toString(),
      table_number: table.table_number,
      capacity: table.capacity,
      status: table.status,
      created_at: table.created_at,
      updated_at: table.updated_at
    }));
    
    sendSuccess(res, formattedData);
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
    
    // Prepare table data, ensuring required fields
    const tableData = {
      ...req.body,
      created_at: req.body.created_at || new Date().toISOString(),
      updated_at: req.body.updated_at || new Date().toISOString(),
      status: req.body.status || 'available'
    };
    
    // Insert new table
    const result = await tables.insertOne(tableData);
    let newTable = await tables.findOne({ _id: result.insertedId });
    
    // Format the table object to match frontend expectations
    newTable = {
      id: newTable._id.toString(),
      table_number: newTable.table_number,
      capacity: newTable.capacity,
      status: newTable.status,
      created_at: newTable.created_at,
      updated_at: newTable.updated_at
    };
    
    sendCreated(res, newTable, 'Table created successfully');
  } catch (error) {
    sendError(res, error);
  }
};

// Update a table
exports.updateTable = async (req, res) => {
  try {
    const db = getDatabase();
    const tables = db.collection('restaurant_tables');
    
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    await tables.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    let updatedTable = await tables.findOne({ _id: new ObjectId(req.params.id) });
    
    // Format the table object to match frontend expectations
    updatedTable = {
      id: updatedTable._id.toString(),
      table_number: updatedTable.table_number,
      capacity: updatedTable.capacity,
      status: updatedTable.status,
      created_at: updatedTable.created_at,
      updated_at: updatedTable.updated_at
    };
    
    sendSuccess(res, updatedTable, 'Table updated successfully');
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