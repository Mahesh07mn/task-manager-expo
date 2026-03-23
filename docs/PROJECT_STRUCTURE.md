# Project Structure Documentation

## 📁 Directory Overview

```
task-manager-expo/
├── 📄 README.md                 # Main project documentation
├── 📄 package.json              # Dependencies and npm scripts
├── 📄 app.json                  # Expo configuration
├── 📄 index.js                  # React Native app entry point
├── 📄 server.js                 # Development backend server
│
├── 📱 screens/                  # Application screens
│   ├── 📄 SplashScreen.jsx      # App launch screen (2.5s)
│   ├── 📄 SignUpScreen.jsx       # User registration with email
│   ├── 📄 LoginScreen.jsx        # User login with email
│   ├── 📄 OTPScreen.jsx          # 4-digit OTP verification
│   ├── 📄 HomeScreen.jsx         # Main task management interface
│   ├── 📄 AccountScreen.jsx      # User profile and settings
│   ├── 📄 CreateTaskScreen.jsx   # Add new task form
│   └── 📄 TaskScreen.jsx         # View tasks by date group
│
├── 🧩 components/               # Reusable components
│   └── 📄 GoogleSignInScreen.jsx # (Legacy) Google Sign-In component
│
├── 🔧 utils/                    # Utility functions and configurations
│   ├── 📄 api.js                # API functions and EmailJS integration
│   └── 📄 theme.js              # Design system (colors, typography, spacing)
│
├── 🎨 assets/                   # Static assets
│   ├── 📁 icon.png              # App icon
│   ├── 📁 splash-icon.png       # Splash screen image
│   ├── 📁 favicon.png           # Web favicon
│   └── 📁 android-icon-*.png     # Android app icons
│
├── 📚 docs/                     # Documentation
│   └── 📄 PROJECT_STRUCTURE.md  # This file
│
└── 📦 node_modules/             # npm dependencies
```

## 📱 Screen Details

### Authentication Screens

#### SplashScreen.jsx
- **Purpose**: App launch screen with logo
- **Duration**: 2.5 seconds
- **Features**: Animated logo, smooth transitions
- **Navigation**: Auto-navigates to SignUpScreen

#### SignUpScreen.jsx
- **Purpose**: User registration with email
- **Features**: Email validation, OTP request
- **Navigation**: To LoginScreen or OTPScreen
- **Dependencies**: utils/api.js, utils/theme.js

#### LoginScreen.jsx
- **Purpose**: User login with email
- **Features**: Email validation, OTP request
- **Navigation**: To SignUpScreen or OTPScreen
- **Dependencies**: utils/api.js, utils/theme.js

#### OTPScreen.jsx
- **Purpose**: 4-digit OTP verification
- **Features**: OTP input, resend functionality, validation
- **Navigation**: Back to source screen or to HomeScreen
- **Dependencies**: utils/api.js, utils/theme.js

### Main Application Screens

#### HomeScreen.jsx
- **Purpose**: Main task management interface
- **Features**: Task display, search, create, swipe-to-delete
- **Components**: TaskCard, floating action buttons
- **Dependencies**: utils/theme.js

#### AccountScreen.jsx
- **Purpose**: User profile and settings
- **Features**: User info display, sign out functionality
- **Navigation**: Back to HomeScreen
- **Dependencies**: utils/theme.js

#### CreateTaskScreen.jsx
- **Purpose**: Add new task form
- **Features**: Task title, description, date picker
- **Navigation**: Back to HomeScreen
- **Dependencies**: utils/theme.js

#### TaskScreen.jsx
- **Purpose**: View tasks grouped by date
- **Features**: Task list, edit, delete, mark complete
- **Navigation**: Back to HomeScreen
- **Dependencies**: utils/theme.js

## 🔧 Utility Files

### utils/api.js
- **Purpose**: API functions and EmailJS integration
- **Functions**: 
  - `checkEmail(email)` - Check if email exists
  - `sendOTP(email)` - Send 4-digit OTP via EmailJS
  - `verifyOTP(email, otp)` - Verify OTP and create user
- **Dependencies**: @emailjs/browser
- **Configuration**: EmailJS credentials

### utils/theme.js
- **Purpose**: Centralized design system
- **Exports**:
  - `colors` - Color palette (primary, background, surface, text)
  - `typography` - Font sizes and weights
  - `spacing` - Consistent spacing values
  - `radius` - Border radius values
- **Usage**: Imported by all screens for consistent styling

## 🧩 Components

### components/GoogleSignInScreen.jsx
- **Status**: Legacy component (not currently used)
- **Purpose**: Google Sign-In integration (removed)
- **Note**: Kept for reference if Google auth is needed later

## 🎨 Assets

### Icons and Images
- **icon.png**: Main app icon
- **splash-icon.png**: Splash screen logo
- **favicon.png**: Web version favicon
- **android-icon-*.png**: Various Android icon sizes

### Asset Management
- **Location**: assets/ directory
- **Usage**: Referenced in app.json configuration
- **Formats**: PNG for icons, SVG for in-app graphics

## 📚 Documentation

### docs/PROJECT_STRUCTURE.md
- **Purpose**: This file - detailed project structure
- **Content**: File descriptions, dependencies, navigation flow
- **Maintenance**: Update when adding new screens or features

## 🔄 Data Flow

### Authentication Flow
1. **SplashScreen** → **SignUpScreen/LoginScreen**
2. **Email Input** → **OTP Request** (api.js)
3. **EmailJS** → **Email Delivery**
4. **OTPScreen** → **OTP Verification** (api.js)
5. **User Creation** → **HomeScreen**

### Task Management Flow
1. **HomeScreen** → **CreateTaskScreen** (new task)
2. **HomeScreen** → **TaskScreen** (view by date)
3. **Task Operations** → **AsyncStorage** (local storage)
4. **AccountScreen** → **Sign Out** → **SignUpScreen**

## 🔗 Dependencies

### Key Dependencies
- **React Native**: Core framework
- **Expo SDK 54**: Development platform
- **@react-native-async-storage/async-storage**: Local storage
- **@emailjs/browser**: Email delivery
- **react-native-svg**: Vector graphics
- **@expo/vector-icons**: Icon library
- **expo-blur**: Blur effects
- **expo-linear-gradient**: Gradient backgrounds

### Development Dependencies
- **@react-native-community/datetimepicker**: Date picker
- **react-native-gesture-handler**: Touch gestures
- **react-native-safe-area-context**: Device compatibility

## 🚀 Scripts

### npm Scripts
- **`npm start`**: Start Expo development server
- **`npm run server`**: Start backend server (if needed)
- **`npm run android`**: Run on Android emulator
- **`npm run ios`**: Run on iOS simulator
- **`npm run web`**: Run in web browser

## 📝 Configuration Files

### app.json
- **Expo Configuration**: App name, icons, plugins
- **Platform Settings**: iOS, Android, web configurations
- **Plugins**: Native module configurations

### package.json
- **Dependencies**: Runtime dependencies
- **Scripts**: Development and build commands
- **Metadata**: Project information

## 🔒 Security Considerations

### Data Protection
- **Local Storage**: Tasks stored on device only
- **User Isolation**: Data separated by user ID
- **OTP Security**: 4-digit codes, 5-minute expiry
- **EmailJS**: Secure email delivery service

### Authentication
- **Email Verification**: Real email addresses required
- **Rate Limiting**: Limited OTP attempts
- **Session Management**: Local session storage

## 🐛 Development Notes

### Common Issues
- **EmailJS Configuration**: Verify credentials in api.js
- **Import Paths**: Ensure correct relative paths after restructure
- **Async/Await**: Use proper async/await for API calls
- **State Management**: Proper state updates in React components

### Debugging
- **Console Logs**: Detailed logging in api.js for EmailJS
- **Expo DevTools**: Use Expo development tools
- **Network Inspector**: Check API calls in development

### Best Practices
- **File Organization**: Keep related files together
- **Import Paths**: Use relative imports consistently
- **Error Handling**: Proper try-catch blocks throughout
- **Code Comments**: Document complex logic and functions

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Maintainer**: TaskMaster Development Team
