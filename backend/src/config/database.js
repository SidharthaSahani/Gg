// src/config/database.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/abnish';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectToDatabase() {
  try {
    if (db) return db;
    
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    db = client.db('abnish');
    
    // Initialize collections with indexes
    await initializeCollections();
    
    return db;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function initializeCollections() {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  // Restaurant Tables
  if (!collectionNames.includes('restaurant_tables')) {
    await db.createCollection('restaurant_tables');
    const tables = db.collection('restaurant_tables');
    await tables.createIndex({ table_number: 1 }, { unique: true });
    await tables.createIndex({ status: 1 });
    console.log('✅ Created restaurant_tables collection');
  }
  
  // Bookings
  if (!collectionNames.includes('bookings')) {
    await db.createCollection('bookings');
    const bookings = db.collection('bookings');
    await bookings.createIndex({ table_id: 1 });
    await bookings.createIndex({ booking_date: 1 });
    await bookings.createIndex({ status: 1 });
    console.log('✅ Created bookings collection');
  }
  
  // Food Menu
  if (!collectionNames.includes('food_menu')) {
    await db.createCollection('food_menu');
    const foodMenu = db.collection('food_menu');
    await foodMenu.createIndex({ category: 1 });
    await foodMenu.createIndex({ available: 1 });
    console.log('✅ Created food_menu collection');
  }
  
  // Carousel Images
  if (!collectionNames.includes('carousel_images')) {
    await db.createCollection('carousel_images');
    const carouselCollection = db.collection('carousel_images');
    
    const count = await carouselCollection.countDocuments();
    if (count === 0) {
      await carouselCollection.insertMany([
        { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: new Date() },
        { url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: new Date() },
        { url: 'https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', createdAt: new Date() }
      ]);
    }
    console.log('✅ Created carousel_images collection');
  }
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

async function closeDatabase() {
  if (client) {
    await client.close();
    console.log('Database connection closed');
  }
}

module.exports = {
  connectToDatabase,
  getDatabase,
  closeDatabase
};