// ========== routes/menuRoutes.js ==========
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const menuController = require('../controllers/menuController');

router.get('/', asyncHandler(menuController.getAllMenuItems));
// Admin routes require authentication
router.post('/', adminAuth, asyncHandler(menuController.createMenuItem));
router.put('/:id', adminAuth, asyncHandler(menuController.updateMenuItem));
router.delete('/:id', adminAuth, asyncHandler(menuController.deleteMenuItem));

module.exports = router;
