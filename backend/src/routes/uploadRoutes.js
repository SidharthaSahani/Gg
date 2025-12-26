// ========== routes/uploadRoutes.js ==========
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const uploadController = require('../controllers/uploadController');
const { upload } = require('../config/multer');

// Regular file upload
router.post('/', upload.single('image'), uploadController.uploadFile);

// Carousel-specific upload
router.post('/carousel', upload.single('image'), asyncHandler(uploadController.uploadCarouselImage));

module.exports = router;