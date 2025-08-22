// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { 
  sendOTPController, 
  testEmailController, 
  sendBulkOTPController 
} = require('../controllers/emailController');

// Middleware for basic request logging (optional)
const logRequest = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

// Apply logging middleware to all email routes
router.use(logRequest);

// Middleware for basic rate limiting (optional but recommended)
const rateLimit = {};
const rateLimitMiddleware = (req, res, next) => {
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10; // Max 10 requests per 15 minutes per IP
  
  if (!rateLimit[clientIP]) {
    rateLimit[clientIP] = [];
  }
  
  // Clean old requests
  rateLimit[clientIP] = rateLimit[clientIP].filter(time => now - time < windowMs);
  
  if (rateLimit[clientIP].length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(windowMs / 1000),
      timestamp: new Date().toISOString()
    });
  }
  
  rateLimit[clientIP].push(now);
  next();
};

/**
 * POST /send-email
 * Send OTP email to a single recipient
 * 
 * Request Body:
 * {
 *   "recipientEmail": "user@example.com",
 *   "recipientName": "John Doe",
 *   "otp": "123456",
 *   "subject": "Your Login Code", // Optional
 *   "expiryMinutes": 10 // Optional, defaults to 10
 * }
 */
router.post('/send-email', rateLimitMiddleware, sendOTPController);

/**
 * POST /test-email
 * Test email configuration
 * 
 * Request Body:
 * {
 *   "testEmail": "your-test@example.com"
 * }
 */
router.post('/test-email', testEmailController);

/**
 * POST /send-bulk-email
 * Send OTP emails to multiple recipients
 * 
 * Request Body:
 * {
 *   "recipients": [
 *     {
 *       "email": "user1@example.com",
 *       "name": "User One",
 *       "otp": "123456"
 *     },
 *     {
 *       "email": "user2@example.com",
 *       "name": "User Two",
 *       "otp": "789012",
 *       "subject": "Custom Subject",
 *       "expiryMinutes": 15
 *     }
 *   ]
 * }
 */
router.post('/send-bulk-email', rateLimitMiddleware, sendBulkOTPController);

/**
 * GET /email/health
 * Health check endpoint for email service
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email service is running',
    timestamp: new Date().toISOString(),
    service: 'email-otp-service',
    version: '1.0.0'
  });
});

// Export the router
module.exports = router;