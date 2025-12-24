// ========== controllers/uploadController.js ==========
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  sendSuccess(res, { url: fileUrl }, 'File uploaded successfully');
};

exports.uploadCarouselImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  try {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    await carouselCollection.insertOne({ url: fileUrl, createdAt: new Date() });
    
    sendSuccess(res, { url: fileUrl }, 'Carousel image uploaded successfully');
  } catch (error) {
    sendError(res, error);
  }
};