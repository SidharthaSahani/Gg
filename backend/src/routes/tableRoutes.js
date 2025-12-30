
// src/routes/tableRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const tableController = require('../controllers/tableController');

router.get('/', asyncHandler(tableController.getAllTables));
// Admin routes require authentication
router.post('/', adminAuth, asyncHandler(tableController.createTable));
router.put('/:id', adminAuth, asyncHandler(tableController.updateTable));
router.delete('/:id', adminAuth, asyncHandler(tableController.deleteTable));

module.exports = router;