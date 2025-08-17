// emailService.js
const nodemailer = require('nodemailer');
const path = require('path');

/**
 * Email Service Configuration
 * Replace these values with your actual email credentials
 */
const EMAIL_CONFIG = {
  // SMTP Configuration - Replace with your email provider settings
  host: 'smtp.gmail.com', // Change to your SMTP host
  port: 587, // 587 for TLS, 465 for SSL
  secure: false, // true for 465, false for other ports
  
  // Authentication - Replace with your credentials
  user: 'your-email@gmail.com', // Your sender email
  pass: 'your-app-password', // Your app password (NOT regular password)
  
  // Sender Details
  senderName: 'Your App Name', // Replace with your app/company name
  senderEmail: 'your-email@gmail.com' // Should match the user above
};

/**
 * Creates and configures the nodemailer transporter
 * @returns {Object} Configured transporter object
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: {
      user: EMAIL_CONFIG.user,
      pass: EMAIL_CONFIG.pass
    },
    // Optional: Add connection timeout and other options
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000 // 10 seconds
  });
};

/**
 * Generates HTML template for OTP email
 * @param {string} recipientName - Name of the recipient
 * @param {string} otp - The OTP code
 * @param {number} expiryMinutes - OTP expiry time in minutes
 * @returns {string} HTML email template
 */
const generateOTPEmailTemplate = (recipientName, otp, expiryMinutes = 10) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .otp-container {
                background-color: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 25px 0;
                border-left: 4px solid #3498db;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #2c3e50;
                letter-spacing: 8px;
                margin: 15px 0;
                font-family: 'Courier New', monospace;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">${EMAIL_CONFIG.senderName}</div>
                <p>One-Time Password Verification</p>
            </div>
            
            <h2>Hello ${recipientName},</h2>
            
            <p>You have requested a One-Time Password (OTP) for verification. Please use the code below to complete your authentication:</p>
            
            <div class="otp-container">
                <p><strong>Your OTP Code:</strong></p>
                <div class="otp-code">${otp}</div>
                <p><em>This code is valid for ${expiryMinutes} minutes</em></p>
            </div>
            
            <div class="warning">
                <strong>Security Notice:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Do not share this code with anyone</li>
                    <li>We will never ask for your OTP via phone or email</li>
                    <li>This code expires in ${expiryMinutes} minutes</li>
                    <li>If you didn't request this code, please ignore this email</li>
                </ul>
            </div>
            
            <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>${EMAIL_CONFIG.senderName} Team</strong></p>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} ${EMAIL_CONFIG.senderName}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * Generates plain text template for OTP email (fallback)
 * @param {string} recipientName - Name of the recipient
 * @param {string} otp - The OTP code
 * @param {number} expiryMinutes - OTP expiry time in minutes
 * @returns {string} Plain text email content
 */
const generateOTPTextTemplate = (recipientName, otp, expiryMinutes = 10) => {
  return `
Hello ${recipientName},

You have requested a One-Time Password (OTP) for verification.

Your OTP Code: ${otp}

This code is valid for ${expiryMinutes} minutes.

SECURITY NOTICE:
- Do not share this code with anyone
- We will never ask for your OTP via phone or email
- This code expires in ${expiryMinutes} minutes
- If you didn't request this code, please ignore this email

If you have any questions, please contact our support team.

Best regards,
${EMAIL_CONFIG.senderName} Team

---
This is an automated message. Please do not reply to this email.
© ${new Date().getFullYear()} ${EMAIL_CONFIG.senderName}. All rights reserved.
  `.trim();
};

/**
 * Validates email parameters
 * @param {Object} params - Email parameters
 * @returns {Object} Validation result
 */
const validateEmailParams = (params) => {
  const errors = [];
  
  if (!params.recipientEmail || !/\S+@\S+\.\S+/.test(params.recipientEmail)) {
    errors.push('Valid recipient email is required');
  }
  
  if (!params.otp || params.otp.toString().length < 4) {
    errors.push('Valid OTP (minimum 4 characters) is required');
  }
  
  if (!params.recipientName || params.recipientName.trim().length < 2) {
    errors.push('Valid recipient name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Main function to send OTP email
 * @param {Object} params - Email parameters
 * @param {string} params.recipientEmail - Recipient's email address
 * @param {string} params.recipientName - Recipient's name
 * @param {string|number} params.otp - The OTP code to send
 * @param {string} [params.subject] - Email subject (optional)
 * @param {number} [params.expiryMinutes=10] - OTP expiry time in minutes
 * @returns {Promise<Object>} Result object with success status and details
 */
const sendOTPEmail = async (params) => {
  try {
    // Validate input parameters
    const validation = validateEmailParams(params);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Validation failed',
        details: validation.errors
      };
    }
    
    // Destructure parameters with unique variable names to avoid conflicts
    const {
      recipientEmail: userEmail,
      recipientName: userName,
      otp: otpCode,
      subject: emailSubject,
      expiryMinutes: otpExpiryMinutes = 10
    } = params;
    
    // Set default subject if not provided
    const finalSubject = emailSubject || `Your OTP Code: ${otpCode}`;
    
    // Create transporter
    const transporter = createTransporter();
    
    // Verify transporter configuration (optional but recommended)
    await transporter.verify();
    console.log('SMTP server connection verified successfully');
    
    // Prepare email content
    const htmlContent = generateOTPEmailTemplate(userName, otpCode, otpExpiryMinutes);
    const textContent = generateOTPTextTemplate(userName, otpCode, otpExpiryMinutes);
    
    // Email options
    const mailOptions = {
      from: {
        name: EMAIL_CONFIG.senderName,
        address: EMAIL_CONFIG.senderEmail
      },
      to: userEmail,
      subject: finalSubject,
      text: textContent,
      html: htmlContent,
      // Optional: Add headers for better deliverability
      headers: {
        'X-Mailer': 'NodeJS-OTP-Service',
        'X-Priority': '1' // High priority
      }
    };
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('OTP email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      recipientEmail: userEmail,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Test function to verify email configuration
 * @param {string} testEmail - Email to send test message to
 * @returns {Promise<Object>} Test result
 */
const testEmailConfiguration = async (testEmail) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    // Send test email
    const testResult = await sendOTPEmail({
      recipientEmail: testEmail,
      recipientName: 'Test User',
      otp: '123456',
      subject: 'Test OTP Email - Configuration Verification'
    });
    
    return testResult;
  } catch (error) {
    return {
      success: false,
      error: 'Configuration test failed: ' + error.message
    };
  }
};

// Export functions
module.exports = {
  sendOTPEmail,
  testEmailConfiguration,
  EMAIL_CONFIG // Export for external configuration if needed
};

/* 
// Example usage in another file:

const { sendOTPEmail } = require('./emailService');

// Basic usage
const sendOTP = async () => {
  const result = await sendOTPEmail({
    recipientEmail: 'user@example.com',
    recipientName: 'John Doe',
    otp: '567890'
  });
  
  if (result.success) {
    console.log('OTP sent successfully!', result.messageId);
  } else {
    console.error('Failed to send OTP:', result.error);
  }
};

// Advanced usage with custom options
const sendCustomOTP = async () => {
  const result = await sendOTPEmail({
    recipientEmail: 'user@example.com',
    recipientName: 'Jane Smith',
    otp: generateOTP(), // Your OTP generation function
    subject: 'Login Verification Code',
    expiryMinutes: 15
  });
  
  return result;
};
*/