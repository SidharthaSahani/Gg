require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'https://grillandgathering.onrender.com'  // Your frontend URL // Replace with actual frontend URL after deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(uploadDir)); // Serve uploaded files

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/abnish';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let carouselImages = [];

async function connectToDatabase() {
  try {
    if (db) return db;
    
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    db = client.db('abnish');
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('restaurant_tables')) {
      await db.createCollection('restaurant_tables');
      const tables = db.collection('restaurant_tables');
      await tables.createIndex({ table_number: 1 }, { unique: true });
      await tables.createIndex({ status: 1 });
    }
    
    if (!collectionNames.includes('bookings')) {
      await db.createCollection('bookings');
      const bookings = db.collection('bookings');
      await bookings.createIndex({ table_id: 1 });
      await bookings.createIndex({ booking_date: 1 });
      await bookings.createIndex({ status: 1 });
    }
    
    if (!collectionNames.includes('food_menu')) {
      await db.createCollection('food_menu');
      const foodMenu = db.collection('food_menu');
      await foodMenu.createIndex({ category: 1 });
      await foodMenu.createIndex({ available: 1 });
    }
    
    // Create carousel_images collection if it doesn't exist
    if (!collectionNames.includes('carousel_images')) {
      await db.createCollection('carousel_images');
      const carouselCollection = db.collection('carousel_images');
      // Insert initial sample images if collection is empty
      const count = await carouselCollection.countDocuments();
      if (count === 0) {
        await carouselCollection.insertMany([
          { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: new Date() },
          { url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: new Date() },
          { url: 'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: new Date() }
        ]);
      }
    }
    
    // Load carousel images from database
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    carouselImages = images.map(img => img.url);
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Add endpoint to get carousel images
app.get('/api/carousel-images', async (req, res) => {
  try {
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageUrls = images.map(img => img.url);
    res.json(imageUrls);
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    res.status(500).json({ error: 'Failed to fetch carousel images' });
  }
});

// Add endpoint to update all carousel images
app.post('/api/carousel-images', async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Invalid images array' });
    }
    
    const carouselCollection = db.collection('carousel_images');
    
    // Clear existing images
    await carouselCollection.deleteMany({});
    
    // Insert new images
    if (images.length > 0) {
      const imageDocs = images.map(url => ({ url, createdAt: new Date() }));
      await carouselCollection.insertMany(imageDocs);
    }
    
    res.json({ success: true, images });
  } catch (error) {
    console.error('Error updating carousel images:', error);
    res.status(500).json({ error: 'Failed to update carousel images' });
  }
});

// File upload endpoint for carousel images
app.post('/api/upload-carousel', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    // Return the URL where the file can be accessed
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Save to database
    const carouselCollection = db.collection('carousel_images');
    await carouselCollection.insertOne({ url: fileUrl, createdAt: new Date() });
    
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Error saving carousel image:', error);
    res.status(500).json({ error: 'Failed to save carousel image' });
  }
});

// Add endpoint to delete a carousel image
app.delete('/api/carousel-images/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    
    if (isNaN(index) || index < 0) {
      return res.status(400).json({ error: 'Invalid image index' });
    }
    
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    
    if (index >= images.length) {
      return res.status(400).json({ error: 'Invalid image index' });
    }
    
    // Remove the image at the specified index
    const deletedImage = images[index];
    await carouselCollection.deleteOne({ _id: deletedImage._id });
    
    // Fetch updated images
    const updatedImages = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageUrls = updatedImages.map(img => img.url);
    
    res.json({ success: true, deletedImage: deletedImage.url, images: imageUrls });
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    res.status(500).json({ error: 'Failed to delete carousel image' });
  }
});

// Add endpoint to update a specific carousel image
app.put('/api/carousel-images/:index', upload.single('image'), async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    
    if (isNaN(index) || index < 0) {
      return res.status(400).json({ error: 'Invalid image index' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const carouselCollection = db.collection('carousel_images');
    const images = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    
    if (index >= images.length) {
      return res.status(400).json({ error: 'Invalid image index' });
    }
    
    // Replace the image at the specified index
    const oldImage = images[index];
    const newImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    await carouselCollection.updateOne(
      { _id: oldImage._id },
      { $set: { url: newImageUrl, updatedAt: new Date() } }
    );
    
    // Fetch updated images
    const updatedImages = await carouselCollection.find({}).sort({ createdAt: 1 }).toArray();
    const imageUrls = updatedImages.map(img => img.url);
    
    res.json({ success: true, oldImage: oldImage.url, newImage: newImageUrl, images: imageUrls });
  } catch (error) {
    console.error('Error updating carousel image:', error);
    res.status(500).json({ error: 'Failed to update carousel image' });
  }
});

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Table Booking API' });
});

// File upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the URL where the file can be accessed
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Restaurant tables routes
app.get('/api/tables', async (req, res) => {
  try {
    const tables = db.collection('restaurant_tables');
    const data = await tables.find({}).sort({ table_number: 1 }).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tables', async (req, res) => {
  try {
    const tables = db.collection('restaurant_tables');
    const result = await tables.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tables/:id', async (req, res) => {
  try {
    const tables = db.collection('restaurant_tables');
    const result = await tables.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tables/:id', async (req, res) => {
  try {
    const tables = db.collection('restaurant_tables');
    const result = await tables.deleteOne({ id: req.params.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bookings routes
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = db.collection('bookings');
    const data = await bookings.find({}).sort({ created_at: -1 }).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const bookings = db.collection('bookings');
    
    // Check if there's already a booking for this table, date, and time slot
    const existingBooking = await bookings.findOne({
      table_id: req.body.table_id,
      booking_date: req.body.booking_date,
      booking_time: req.body.booking_time,
      status: { $ne: 'completed' }
    });
    
    if (existingBooking) {
      return res.status(409).json({ 
        error: 'This time slot is already booked for the selected table',
        booking: existingBooking
      });
    }
    
    // If no existing booking, create the new one
    const result = await bookings.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const bookings = db.collection('bookings');
    const result = await bookings.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const bookings = db.collection('bookings');
    const result = await bookings.deleteOne({ id: req.params.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/table/:tableId', async (req, res) => {
  try {
    // Instead of deleting bookings, we'll mark them as completed/cancelled
    // This preserves the booking history for customer data
    const bookings = db.collection('bookings');
    const result = await bookings.updateMany(
      { table_id: req.params.tableId, status: { $ne: 'completed' } },
      { $set: { status: 'completed', completed_at: new Date().toISOString() } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to mark bookings as completed
app.put('/api/bookings/table/:tableId', async (req, res) => {
  try {
    const { status } = req.body;
    const bookings = db.collection('bookings');
    const result = await bookings.updateMany(
      { table_id: req.params.tableId, status: { $ne: 'completed' } },
      { $set: { status, completed_at: new Date().toISOString() } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Food menu routes
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = db.collection('food_menu');
    const data = await menuItems.find({}).sort({ created_at: -1 }).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const menuItems = db.collection('food_menu');
    const result = await menuItems.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const menuItems = db.collection('food_menu');
    const result = await menuItems.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    const menuItems = db.collection('food_menu');
    const result = await menuItems.deleteOne({ id: req.params.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to database and start server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});