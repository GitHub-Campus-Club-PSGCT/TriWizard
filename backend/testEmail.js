// testBothConfigs.js
const nodemailer = require('nodemailer');

const testConfig1 = async () => {
  console.log('Testing Configuration 1: Port 587 with TLS');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: 'lksubhasree@gmail.com',
      pass: 'xjzshyvavbxjxpsq'
    },
    connectionTimeout: 60000,
    logger: true
  });

  try {
    await transporter.verify();
    
    console.log('✅ Configuration 1 SUCCESS!');
    return true;
  } catch (error) {
    console.log('❌ Configuration 1 FAILED:', error.message);
    return false;
  }
};

const testConfig2 = async () => {
  console.log('Testing Configuration 2: Port 465 with SSL');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: 'lksubhasree@gmail.com',
      pass: 'xjzshyvavbxjxpsq'
    },
    connectionTimeout: 60000,
    logger: true
  });

  try {
    await transporter.verify();
    console.log('✅ Configuration 2 SUCCESS!');
    return true;
  } catch (error) {
    console.log('❌ Configuration 2 FAILED:', error.message);
    return false;
  }
};

const runTests = async () => {
  console.log('Starting SMTP configuration tests...\n');
  
  const config1Works = await testConfig1();
  console.log('');
  
  if (!config1Works) {
    const config2Works = await testConfig2();
    
    if (config2Works) {
      console.log('\n🎉 Use Configuration 2 (Port 465, SSL) in your emailservice.js');
    } else {
      console.log('\n😞 Both configurations failed. Check network/firewall settings.');
    }
  } else {
    console.log('\n🎉 Use Configuration 1 (Port 587, TLS) in your emailservice.js');
  }
};

// sendTestEmail.js
const { sendOTPEmail } = require('./config/emailservice');

const testSendEmail = async () => {
  console.log('Sending test OTP email...');
  
  try {
    const result = await sendOTPEmail({
      recipientEmail: 'lksubhasree@gmail.com', // Send to yourself first
      recipientName: 'Sree Test',
      otp: '123456',
      subject: 'Test OTP - NodeJS Email Service',
      expiryMinutes: 10
    });
    
    if (result.success) {
      console.log('🎉 SUCCESS! Email sent successfully');
      console.log('📧 Message ID:', result.messageId);
      console.log('📍 Sent to:', result.recipientEmail);
      console.log('⏰ Timestamp:', result.timestamp);
      console.log('\n✅ Check your inbox/spam folder!');
    } else {
      console.log('❌ FAILED to send email');
      console.log('Error:', result.error);
      console.log('Details:', result.details);
    }
  } catch (error) {
    console.log('💥 Test crashed:', error.message);
  }
};

//testSendEmail();


runTests();
testSendEmail();