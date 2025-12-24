// ========== routes/uploadRoutes.js ==========
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const uploadController = require('../controllers/uploadController');
const { upload } = require('../config/multer');