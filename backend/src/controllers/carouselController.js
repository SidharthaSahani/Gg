// ========== controllers/carouselController.js ==========
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/responseHelper');

exports.getCarouselImages = async (req, res) => {
  try {
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageUrls = images.map(img => img.url);
    sendSuccess(res, imageUrls);
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateAllCarouselImages = async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ success: false, error: 'Invalid images array' });
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    
    await carouselCollection.deleteMany({});
    if (images.length > 0) {
      const imageDocs = images.map(url => ({ url, createdAt: new Date() }));
      await carouselCollection.insertMany(imageDocs);
    }
    
    sendSuccess(res, { images }, 'Carousel images updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};

exports.deleteCarouselImage = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0) {
      return res.status(400).json({ success: false, error: 'Invalid image index' });
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    
    if (index >= images.length) {
      return res.status(400).json({ success: false, error: 'Invalid image index' });
    }
    
    const deletedImage = images[index];
    await carouselCollection.deleteOne({ _id: deletedImage._id });
    
    const updatedImages = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageUrls = updatedImages.map(img => img.url);
    
    sendSuccess(res, { deletedImage: deletedImage.url, images: imageUrls }, 'Image deleted successfully');
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateCarouselImage = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0 || !req.file) {
      return res.status(400).json({ 
        success: false, 
        error: !req.file ? 'No file uploaded' : 'Invalid image index' 
      });
    }
    
    const db = getDatabase();
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    
    if (index >= images.length) {
      return res.status(400).json({ success: false, error: 'Invalid image index' });
    }
    
    const oldImage = images[index];
    const newImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    await carouselCollection.updateOne(
      { _id: oldImage._id },
      { $set: { url: newImageUrl, updatedAt: new Date() } }
    );
    
    const updatedImages = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageUrls = updatedImages.map(img => img.url);
    
    sendSuccess(res, { oldImage: oldImage.url, newImage: newImageUrl, images: imageUrls }, 'Image updated successfully');
  } catch (error) {
    sendError(res, error);
  }
};