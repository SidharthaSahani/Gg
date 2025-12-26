// server.js
require('dotenv').config();
const app = require('./src/app');
const { connectToDatabase, closeDatabase } = require('./src/config/database');

const port = process.env.PORT || 5001;

// Connect to database and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Start Express server
    const server = app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        await closeDatabase();
        console.log('Database connection closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();