// ========== controllers/menuController.js ==========
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError, sendCreated, formatDocuments, formatDocument } = require('../utils/responseHelper');

exports.getAllMenuItems = async (req, res) => {
  try {
    const db = getDatabase();
    const menuItems = db.collection('food_menu');
    const data = await menuItems.find({}).sort({ created_at: -1 }).toArray();
    sendSuccess(res, formatDocuments(data));
  } catch (error) {
    sendError(res, error);
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const db = getDatabase();
    const menuItems = db.collection('food_menu');
    const result = await menuItems.insertOne(req.body);
    const newMenuItem = await menuItems.findOne({ _id: result.insertedId });
    sendCreated(res, formatDocument(newMenuItem), 'Menu item created successfully');
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const db = getDatabase();
    const menuItems = db.collection('food_menu');
    await menuItems.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    const updatedMenuItem = await menuItems.findOne({ _id: new ObjectId(req.params.id) });
    sendSuccess(res, formatDocument(updatedMenuItem), 'Menu item updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const db = getDatabase();
    const menuItems = db.collection('food_menu');
    const result = await menuItems.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    sendSuccess(res, { deletedCount: result.deletedCount }, 'Menu item deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
};
