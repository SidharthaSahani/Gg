// ========== routes/menuRoutes.js ==========
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const menuController = require('../controllers/menuController');

router.get('/', asyncHandler(menuController.getAllMenuItems));
router.post('/', asyncHandler(menuController.createMenuItem));
router.put('/:id', asyncHandler(menuController.updateMenuItem));
router.delete('/:id', asyncHandler(menuController.deleteMenuItem));

module.exports = router;
