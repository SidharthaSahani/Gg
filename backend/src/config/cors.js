// src/config/cors.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'https://grillandgathering.onrender.com',
    process.env.FRONTEND_URL // Add custom frontend URL from env
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;