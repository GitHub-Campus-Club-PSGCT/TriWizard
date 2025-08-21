// controllers/emailController.js
const { sendOTPEmail, testEmailConfiguration } = require('../config/emailservice');

/**
 * Controller function to handle OTP email sending
 * This function is called by the route when /send-email endpoint is hit
 */
const sendOTPController = async (req, res) => {
  try {
    // Extract data from request body
    const { recipientEmail, recipientName, otp, subject, expiryMinutes } = req.body;
    
    // Validate required fields
    if (!recipientEmail || !recipientName || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: recipientEmail, recipientName, and otp are required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Call the email service function
    const emailResult = await sendOTPEmail({
      recipientEmail,
      recipientName,
      otp,
      subject,
      expiryMinutes
    });
    
    // Send response based on email result
    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'OTP email sent successfully',
        messageId: emailResult.messageId,
        recipientEmail: emailResult.recipientEmail,
        timestamp: emailResult.timestamp
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email',
        error: emailResult.error,
        timestamp: emailResult.timestamp
      });
    }
    
  } catch (error) {
    console.error('Error in sendOTPController:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Controller function to test email configuration
 * This function is called by the route when /test-email endpoint is hit
 */
const testEmailController = async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: 'testEmail is required in request body',
        timestamp: new Date().toISOString()
      });
    }
    
    const testResult = await testEmailConfiguration(testEmail);
    
    if (testResult.success) {
      res.status(200).json({
        success: true,
        message: 'Email configuration test successful',
        details: testResult,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Email configuration test failed',
        error: testResult.error,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Error in testEmailController:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Controller function to handle bulk OTP sending
 * For sending OTPs to multiple recipients
 */
const sendBulkOTPController = async (req, res) => {
  try {
    const { recipients } = req.body; // Array of {email, name, otp}
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'recipients array is required and must contain at least one recipient',
        timestamp: new Date().toISOString()
      });
    }
    
    const results = [];
    const errors = [];
    
    // Send emails concurrently
    const emailPromises = recipients.map(async (recipient, index) => {
      try {
        const emailResult = await sendOTPEmail({
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          otp: recipient.otp,
          subject: recipient.subject,
          expiryMinutes: recipient.expiryMinutes
        });
        
        if (emailResult.success) {
          results.push({
            index,
            email: recipient.email,
            success: true,
            messageId: emailResult.messageId
          });
        } else {
          errors.push({
            index,
            email: recipient.email,
            error: emailResult.error
          });
        }
      } catch (error) {
        errors.push({
          index,
          email: recipient.email,
          error: error.message
        });
      }
    });
    
    await Promise.all(emailPromises);
    
    res.status(200).json({
      success: errors.length === 0,
      message: `Processed ${recipients.length} emails`,
      successCount: results.length,
      errorCount: errors.length,
      results,
      errors,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in sendBulkOTPController:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Export all controller functions
module.exports = {
  sendOTPController,
  testEmailController,
  sendBulkOTPController
};