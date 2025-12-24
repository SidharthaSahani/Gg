
// src/routes/tableRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const tableController = require('../controllers/tableController');

router.get('/', asyncHandler(tableController.getAllTables));
router.post('/', asyncHandler(tableController.createTable));
router.put('/:id', asyncHandler(tableController.updateTable));
router.delete('/:id', asyncHandler(tableController.deleteTable));

module.exports = router;