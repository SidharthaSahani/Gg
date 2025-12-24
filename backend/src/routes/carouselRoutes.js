// ========== routes/carouselRoutes.js ==========
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const carouselController = require('../controllers/carouselController');
const { upload } = require('../config/multer');

router.get('/', asyncHandler(carouselController.getCarouselImages));
router.post('/', asyncHandler(carouselController.updateAllCarouselImages));
router.delete('/:index', asyncHandler(carouselController.deleteCarouselImage));
router.put('/:index', upload.single('image'), asyncHandler(carouselController.updateCarouselImage));

module.exports = router;
