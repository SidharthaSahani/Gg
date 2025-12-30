// ========== routes/carouselRoutes.js ==========
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const adminAuth = require('../middleware/adminAuth');
const carouselController = require('../controllers/carouselController');
const { upload } = require('../config/multer');

router.get('/', asyncHandler(carouselController.getCarouselImages));
// Admin routes require authentication
router.post('/', adminAuth, asyncHandler(carouselController.updateAllCarouselImages));
router.delete('/:index', adminAuth, asyncHandler(carouselController.deleteCarouselImage));
router.put('/:index', adminAuth, upload.single('image'), asyncHandler(carouselController.updateCarouselImage));

module.exports = router;
