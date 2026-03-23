# Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for mobile testing)
- EmailJS account (for OTP functionality)

### Installation Steps

#### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd task-manager-expo

# Install dependencies
npm install
```

#### 2. Configure EmailJS
```bash
# Open the API configuration file
open utils/api.js
```

Update these lines with your EmailJS credentials:
```javascript
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';
```

#### 3. Start the App
```bash
# Start development server
npm start
```

#### 4. Test on Mobile
- Open Expo Go app
- Scan QR code from terminal
- Or use web simulator with 'w' key

## 🔧 EmailJS Setup

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. Go to **Email Services** → **Add New Service**
2. Choose your email provider (Gmail, Outlook, etc.)
3. Connect your email account
4. Note your **Service ID**

### Step 3: Create Email Template
1. Go to **Email Templates** → **Create New Template**
2. Use this template structure:

```
Subject: Your TaskMaster OTP Code

Hello,

Your OTP code is: {{otp_code}}

This code will expire in 5 minutes.

Thanks,
TaskMaster App
```

3. Note your **Template ID**

### Step 4: Get API Keys
1. Go to **Integration** → **API Keys**
2. Copy your **Public Key**

### Step 5: Update Configuration
Update `utils/api.js` with your credentials:
```javascript
const EMAILJS_SERVICE_ID = 'service_yqr8esg';     // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_l72v7e1';   // Your Template ID
const EMAILJS_PUBLIC_KEY = 'lbGy-wXUg1u45RD6J';    // Your Public Key
```

## 📱 Testing the App

### Authentication Flow
1. **Launch App** → Wait for splash screen
2. **Sign Up** → Enter email address
3. **Receive OTP** → Check email (or console for demo)
4. **Enter OTP** → Use 4-digit code
5. **Access Home** → Task management interface

### Task Management
1. **Create Tasks** → Tap + button or search bar
2. **View Tasks** → Organized by date
3. **Delete Tasks** → Swipe left on any task
4. **Account Settings** → Tap profile icon

## 🛠 Development Setup

### Running on Different Platforms

#### Web Browser
```bash
npm start
# Press 'w' in terminal to open web version
```

#### iOS Simulator
```bash
npm start
# Press 'i' in terminal to open iOS simulator
```

#### Android Emulator
```bash
npm start
# Press 'a' in terminal to open Android emulator
```

#### Physical Device
```bash
npm start
# Scan QR code with Expo Go app
```

### Development Tools

#### Expo DevTools
- Open in browser: http://localhost:8081
- View device logs
- Inspect network requests
- Debug React components

#### Console Debugging
- Check terminal for logs
- EmailJS request/response logging
- OTP codes shown in demo mode
- Error details and stack traces

## 🔍 Troubleshooting

### Common Issues

#### "Couldn't reach server"
```bash
# Check EmailJS configuration
cat utils/api.js

# Verify credentials are correct
# Check internet connection
# Test EmailJS service status
```

#### "OTP not received"
```bash
# Check spam/junk folder
# Verify EmailJS template variables: {{otp_code}}, {{to_email}}
# Check EmailJS service is active
# Look for OTP in console (demo mode)
```

#### "Import errors"
```bash
# Verify file structure
ls -la screens/
ls -la utils/

# Check import paths in files
grep -r "from.*theme" screens/
grep -r "from.*api" screens/
```

#### "Build errors"
```bash
# Clear cache
npx expo start --clear

# Reset dependencies
rm -rf node_modules package-lock.json
npm install

# Check Expo CLI version
npx expo --version
```

### Debug Mode Features

The app includes comprehensive debug logging:

#### EmailJS Debugging
```javascript
// Console shows:
// - EmailJS request details
// - Response status and headers
// - Parsed response data
// - Error information
```

#### OTP Debugging
```javascript
// Console shows:
// - Generated OTP codes
// - Storage operations
// - Verification attempts
// - Error messages
```

#### Navigation Debugging
```javascript
// Console shows:
// - Screen transitions
// - State changes
// - User creation
// - Task operations
```

## 📁 File Structure Reference

### Key Files to Know

#### Configuration Files
- `package.json` - Dependencies and scripts
- `app.json` - Expo configuration
- `utils/api.js` - EmailJS and API functions
- `utils/theme.js` - Design system

#### Screen Files
- `screens/SplashScreen.jsx` - App launch
- `screens/SignUpScreen.jsx` - Registration
- `screens/LoginScreen.jsx` - Login
- `screens/OTPScreen.jsx` - OTP verification
- `screens/HomeScreen.jsx` - Main interface
- `screens/AccountScreen.jsx` - User profile

#### Important Directories
- `screens/` - All application screens
- `utils/` - Utility functions and configs
- `assets/` - Images and icons
- `docs/` - Documentation

## 🎨 Customization

### Theme Customization
Edit `utils/theme.js` to change:
```javascript
// Colors
colors.primary = '#YOUR_COLOR';
colors.background = '#YOUR_COLOR';

// Typography
typography.display = { fontSize: 32, fontWeight: 'bold' };

// Spacing
spacing.s = 4;   // Small spacing
spacing.m = 16;  // Medium spacing
spacing.l = 24;  // Large spacing
```

### Email Template Customization
Modify your EmailJS template to include:
```html
<p>Hello {{to_email}},</p>
<p>Your OTP code is: <strong>{{otp_code}}</strong></p>
<p>This code expires in 5 minutes.</p>
<p>Thanks,<br>{{from_name}}</p>
```

### App Configuration
Edit `app.json` for:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait"
  }
}
```

## 🚀 Deployment

### Building for Production

#### Expo Build Service
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Build for web
npx expo build:web
```

#### Local Builds
```bash
# Generate native code
npx expo prebuild

# Build iOS
cd ios && xcodebuild

# Build Android
cd android && ./gradlew assembleRelease
```

### Publishing

#### App Store (iOS)
1. Build iOS app
2. Upload to App Store Connect
3. Submit for review

#### Google Play (Android)
1. Build Android APK/AAB
2. Upload to Google Play Console
3. Submit for review

## 📞 Support Resources

### Documentation
- **README.md** - Main project documentation
- **PROJECT_STRUCTURE.md** - Detailed file structure
- **SETUP_GUIDE.md** - This setup guide

### Community Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

### Debug Tools
- **Expo DevTools** - In-app debugging
- **React DevTools** - Component inspection
- **Network Inspector** - API call monitoring
- **Console Logs** - Error tracking

---

**Happy Coding! 🚀**

If you encounter any issues, check the troubleshooting section or refer to the main README.md file.
