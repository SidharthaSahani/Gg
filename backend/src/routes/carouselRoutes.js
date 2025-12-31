// ========== routes/carouselRoutes.js ==========
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const carouselController = require('../controllers/carouselController');
const { upload } = require('../config/multer');

// Public route - get all images (no auth required)
router.get('/', asyncHandler(carouselController.getCarouselImages));

// ✅ NEW: Upload single carousel image (MUST BE BEFORE /:index routes)
router.post('/upload', adminAuth, upload.single('image'), asyncHandler(carouselController.addCarouselImage));

// Update all images at once
router.post('/', adminAuth, asyncHandler(carouselController.updateAllCarouselImages));

// Delete image by index
router.delete('/:index', adminAuth, asyncHandler(carouselController.deleteCarouselImage));

// Update single image by index
router.put('/:index', adminAuth, upload.single('image'), asyncHandler(carouselController.updateCarouselImage));

module.exports = router;