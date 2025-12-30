// src/middleware/adminAuth.js
// Simple admin authentication middleware
const ADMIN_CREDENTIALS = {
  email: 'admin@restaurant.com',
  password: 'admin123'
};

const adminAuth = (req, res, next) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No authorization header provided.'
    });
  }
  
  // Check if it's a Bearer token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }
  
  try {
    // Decode the token (which is base64 encoded email)
    const decodedEmail = decodeURIComponent(atob(token));
    
    // Verify that the decoded email matches admin credentials
    if (decodedEmail === ADMIN_CREDENTIALS.email) {
      req.admin = { email: decodedEmail };
      next();
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Access denied.'
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token format.'
    });
  }
};

module.exports = adminAuth;