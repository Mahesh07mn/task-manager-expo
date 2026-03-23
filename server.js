const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (in production, use a database)
const otpStore = {};
const users = [];

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if email exists
app.post('/check-email', (req, res) => {
  const { email } = req.body;
  
  // For demo, we'll say no email exists (new user)
  // In production, check your database
  const existingUser = users.find(user => user.email === email);
  
  if (existingUser) {
    res.json({ 
      success: true, 
      exists: true,
      message: 'Email exists, please sign in'
    });
  } else {
    res.json({ 
      success: true, 
      exists: false,
      message: 'New email, please sign up'
    });
  }
});

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.json({ 
      success: false, 
      message: 'Email is required' 
    });
  }
  
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  // Store OTP (in production, use Redis or database)
  otpStore[email] = {
    otp,
    expiresAt,
    attempts: 0
  };
  
  console.log(`OTP for ${email}: ${otp}`); // For demo purposes
  
  res.json({ 
  success: true, 
  message: 'OTP sent successfully',
  // For demo, include OTP in response (remove in production)
  otp: otp // Remove this line in production
});
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.json({ 
      success: false, 
      message: 'Email and OTP are required' 
    });
  }
  
  const storedData = otpStore[email];
  
  if (!storedData) {
    return res.json({ 
      success: false, 
      message: 'OTP not found or expired' 
    });
  }
  
  if (Date.now() > storedData.expiresAt) {
    delete otpStore[email];
    return res.json({ 
      success: false, 
      message: 'OTP expired' 
    });
  }
  
  if (storedData.attempts >= 3) {
    delete otpStore[email];
    return res.json({ 
      success: false, 
      message: 'Too many attempts. Please request a new OTP' 
    });
  }
  
  if (storedData.otp !== otp) {
    storedData.attempts++;
    return res.json({ 
      success: false, 
      message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining` 
    });
  }
  
  // OTP is valid - create or get user
  let user = users.find(u => u.email === email);
  
  if (!user) {
    // Create new user
    user = {
      id: `user_${Date.now()}`,
      email: email,
      name: email.split('@')[0], // Use email prefix as name
      createdAt: new Date().toISOString()
    };
    users.push(user);
  }
  
  // Clean up OTP
  delete otpStore[email];
  
  res.json({ 
    success: true, 
    message: 'OTP verified successfully',
    user: user
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    users: users.length,
    activeOTPs: Object.keys(otpStore).length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 OTP endpoints ready:`);
  console.log(`   POST /check-email - Check if email exists`);
  console.log(`   POST /send-otp - Send OTP to email`);
  console.log(`   POST /verify-otp - Verify OTP`);
  console.log(`   GET  /health - Server status`);
  console.log(`\n📝 Note: For demo purposes, OTPs are logged to console and included in response`);
  console.log(`📝 To use real email, configure SMTP credentials in server.js`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});
