# TaskMaster - React Native Task Manager

A modern task management application built with React Native and Expo, featuring email/OTP authentication and beautiful UI.

## 🚀 Features

### Authentication
- **Email/OTP Login** - Secure authentication with 4-digit OTP codes
- **EmailJS Integration** - Real email delivery for OTP codes
- **User Management** - Per-user task data storage
- **Account Screen** - User profile and settings

### Task Management
- **Create Tasks** - Add new tasks with descriptions
- **Organize by Date** - Tasks grouped by creation date
- **Swipe to Delete** - iOS-style swipe gestures
- **Persistent Storage** - Tasks saved per user account

### UI/UX
- **Modern Design** - Clean, intuitive interface
- **Glass Effects** - Beautiful blur and transparency effects
- **Smooth Animations** - Fluid transitions and micro-interactions
- **Dark Theme** - Easy on the eyes dark color scheme

## 📱 Screens

1. **SplashScreen** - App launch screen (2.5s)
2. **SignUpScreen** - Email registration with OTP
3. **LoginScreen** - Email login with OTP  
4. **OTPScreen** - 4-digit OTP verification
5. **HomeScreen** - Main task management interface
6. **AccountScreen** - User profile and settings
7. **CreateTaskScreen** - Add new tasks
8. **TaskScreen** - View tasks by date group

## 🛠 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo SDK 54** - Development platform and tools
- **React Native Gesture Handler** - Touch gesture handling
- **React Native Reanimated** - Smooth animations
- **React Native Safe Area Context** - Device compatibility
- **React Native SVG** - Vector graphics and icons

### Backend Services
- **EmailJS** - Email delivery service for OTP codes
- **AsyncStorage** - Local data persistence
- **React Native Vector Icons** - Icon library

### Development Tools
- **Metro** - JavaScript bundler
- **Expo Go** - Development testing
- **ESLint** - Code quality

## 📁 Project Structure

```
task-manager-expo/
├── 📄 README.md                 # This file
├── 📄 package.json              # Dependencies and scripts
├── 📄 app.json                  # Expo configuration
├── 📄 index.js                  # App entry point
├── 📄 theme.js                  # Design system (colors, typography, spacing)
├── 📄 api.js                    # API functions and EmailJS integration
├── 📄 server.js                 # Backend server (for development)
│
├── 📱 Screens/                  # Main application screens
│   ├── 📄 SplashScreen.jsx      # App launch screen
│   ├── 📄 SignUpScreen.jsx       # User registration
│   ├── 📄 LoginScreen.jsx        # User login
│   ├── 📄 OTPScreen.jsx          # OTP verification
│   ├── 📄 HomeScreen.jsx         # Main task interface
│   ├── 📄 AccountScreen.jsx      # User profile
│   ├── 📄 CreateTaskScreen.jsx   # Add new tasks
│   └── 📄 TaskScreen.jsx         # View tasks by date
│
├── 🎨 Assets/                   # Static assets
│   ├── 📁 icon.png               # App icon
│   ├── 📁 splash-icon.png        # Splash screen image
│   └── 📁 android-icon-*.png      # Android icons
│
└── 📦 node_modules/              # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-expo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure EmailJS**
   - Create account at [EmailJS.com](https://www.emailjs.com/)
   - Get your Service ID, Template ID, and Public Key
   - Update `api.js` with your credentials:
   ```javascript
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```

4. **Start the app**
   ```bash
   npm start
   ```

5. **Test on mobile**
   - Open Expo Go app
   - Scan QR code from terminal
   - Or use web simulator with 'w' key

## 🔧 Configuration

### EmailJS Setup

1. **Create EmailJS Account**
   - Sign up at [EmailJS.com](https://www.emailjs.com/)
   - Verify your email address

2. **Create Email Service**
   - Go to Email Services → Add New Service
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your email account

3. **Create Email Template**
   - Go to Email Templates → Create New Template
   - Use these variables in your template:
     - `{{to_email}}` - Recipient email
     - `{{otp_code}}` - 4-digit OTP code
     - `{{from_name}}` - "TaskMaster App"

4. **Get Your Keys**
   - Service ID: From Email Services page
   - Template ID: From Email Templates page  
   - Public Key: From Integration → API Keys page

### Template Example

```
Subject: Your TaskMaster OTP Code

Hello,

Your OTP code is: {{otp_code}}

This code will expire in 5 minutes.

Thanks,
TaskMaster App
```

## 📱 Usage

### Authentication Flow
1. **Launch App** → Splash screen (2.5s)
2. **Sign Up/Login** → Enter email address
3. **Receive OTP** → Check email for 4-digit code
4. **Enter OTP** → Verify and login
5. **Access Home** → View and manage tasks

### Task Management
1. **View Tasks** - Organized by date
2. **Create Tasks** - Tap + button or search bar
3. **Delete Tasks** - Swipe left on any task
4. **View Details** - Tap on task group

### Account Management
1. **Access Account** - Tap profile icon
2. **View Profile** - Email and user info
3. **Sign Out** - Logout and return to login

## 🎨 Design System

The app uses a centralized design system defined in `theme.js`:

### Colors
- **Primary**: Action buttons and accents
- **Background**: Dark theme backgrounds
- **Surface**: Cards and floating elements
- **Text**: Various text colors for hierarchy

### Typography
- **Display**: Large headings
- **Heading**: Medium headings
- **Body**: Regular text
- **Caption**: Small supporting text

### Spacing
- **XS**: 4px - Micro spacing
- **S**: 8px - Small spacing
- **M**: 16px - Medium spacing
- **L**: 24px - Large spacing
- **XL**: 32px - Extra large spacing

## 🔒 Security

### Data Protection
- **Local Storage** - Tasks stored locally on device
- **User Isolation** - Data separated by user ID
- **OTP Expiration** - Codes expire after 5 minutes
- **Rate Limiting** - Max 3 OTP attempts per request

### Authentication
- **Email Verification** - Real email addresses required
- **Secure OTP** - 4-digit random codes
- **Session Management** - User sessions managed locally

## 🐛 Troubleshooting

### Common Issues

**"Couldn't reach server"**
- Check EmailJS credentials in `api.js`
- Verify internet connection
- Check EmailJS service status

**"OTP not received"**
- Check spam/junk folder
- Verify EmailJS template variables
- Check EmailJS service configuration

**"Tasks not saving"**
- Check AsyncStorage permissions
- Verify user authentication
- Restart the app

**"EmailJS errors"**
- Check console logs for detailed error messages
- Verify Service ID, Template ID, and Public Key
- Ensure EmailJS service is active

### Debug Mode

The app includes debug logging that shows:
- EmailJS request details
- OTP codes (in demo mode)
- Storage operations
- Error details

Check the console/terminal for debug information.

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review console logs for errors
- Verify EmailJS configuration
- Test with different email providers

---

**Built with ❤️ using React Native and Expo**
