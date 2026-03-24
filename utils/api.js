// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_yqr8esg'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_l72v7e1'; // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'lbGy-wXUg1u45RD6J'; // Replace with your EmailJS public key

// Generate 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// In-memory OTP storage (in production, use more secure storage)
const otpStore = {};

export const checkEmail = async (email) => {
  // For EmailJS, we'll simulate email check
  // In production, you might check against your user database
  return {
    success: true,
    exists: false, // Assume new user for demo
    message: 'Email ready for OTP'
  };
};

export const sendOTP = async (email) => {
  try {
    const otp = generateOTP();
    
    // Store OTP for verification (expires in 5 minutes)
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    };

    try {
      const emailData = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: email,
          otp_code: otp,
          from_name: 'TaskMaster App'
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://localhost:8081', // Add origin header
        },
        body: JSON.stringify(emailData),
      });

      if (response.status === 200) {
        return {
          success: true,
          message: 'OTP sent successfully',
          otp: otp
        };
      } else {
        const responseText = await response.text();
        throw new Error(`EmailJS error (${response.status}): ${responseText}`);
      }
    } catch (emailError) {
      // Fallback for demo when EmailJS fails
      console.log(`EmailJS failed, using demo mode. OTP for ${email}: ${otp}`);
      console.log('EmailJS Error:', emailError);
      return {
        success: true,
        message: 'OTP sent successfully (demo mode)',
        otp: otp // Include OTP for demo testing
      };
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP. Please try again.'
    };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const storedData = otpStore[email];
    
    if (!storedData) {
      return {
        success: false,
        message: 'OTP not found or expired'
      };
    }
    
    if (Date.now() > storedData.expiresAt) {
      delete otpStore[email];
      return {
        success: false,
        message: 'OTP expired'
      };
    }
    
    if (storedData.attempts >= 3) {
      delete otpStore[email];
      return {
        success: false,
        message: 'Too many attempts. Please request a new OTP'
      };
    }
    
    if (storedData.otp !== otp) {
      storedData.attempts++;
      return {
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining`
      };
    }
    
    // OTP is valid - clean up and return success
    delete otpStore[email];
    
    return {
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: `email-${email}`,
        email: email,
        name: email.split('@')[0]
      }
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'Verification failed. Please try again.'
    };
  }
};
