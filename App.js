import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './screens/SplashScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import HomeScreen from './screens/HomeScreen';
import AccountScreen from './screens/AccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskScreen from './screens/TaskScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import {
  registerForPushNotifications,
  scheduleTaskExpiryNotification,
  cancelTaskNotification,
  rescheduleAllTaskNotifications,
} from './utils/notifications';
import * as Notifications from 'expo-notifications';

// ─── Sample tasks (replace with API data later) ───────────────────────────────
const buildSampleTasks = () => {
  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const twoDays   = new Date(today); twoDays.setDate(today.getDate() - 2);
  const threeDays = new Date(today); threeDays.setDate(today.getDate() - 3);

  const fmt = (d) => d.toISOString().split("T")[0];

  const makeDateTime = (d, hours, minutes) => {
    const dt = new Date(d);
    dt.setHours(hours, minutes, 0, 0);
    return dt.toISOString();
  };

  return [
    {
      id: "t1", name: "House grocery", subtitle: "Expires at 8:52 AM", date: fmt(today),
      dateTime: makeDateTime(today, 8, 52),
      items: [
        { id: "i1", name: "Chicken / Fish - 2 kgs", done: true },
        { id: "i2", name: "Toor dal / Moong dal",   done: false },
        { id: "i3", name: "Turmeric powder",         done: false },
        { id: "i4", name: "Tomatoes",                done: false },
        { id: "i5", name: "Onions",                  done: false },
        { id: "i6", name: "Spinach (keerai)",         done: false },
      ],
    },
    {
      id: "t2", name: "Office", subtitle: "Expires at 6:00 PM", date: fmt(today),
      dateTime: makeDateTime(today, 18, 0),
      items: [
        { id: "i7", name: "Submit timesheet",                    done: false },
        { id: "i8", name: "Update feedback from client review",  done: false },
        { id: "i9", name: "Setup call with manager",             done: false },
      ],
    },
    {
      id: "t3", name: "Office", subtitle: "1 Remaining", date: fmt(yesterday),
      items: [
        { id: "i10", name: "Send weekly report",   done: true },
        { id: "i11", name: "Review PR comments",   done: true },
        { id: "i12", name: "Update project board", done: false },
      ],
    },
    {
      id: "t4", name: "Furniture list", subtitle: "Completed", date: fmt(twoDays),
      items: [
        { id: "i13", name: "Sofa - 3 seater", done: true },
        { id: "i14", name: "Coffee table",    done: true },
        { id: "i15", name: "Bookshelf",       done: true },
      ],
    },
    {
      id: "t5", name: "Online shopping", subtitle: "2 Remaining", date: fmt(twoDays),
      items: [
        { id: "i16", name: "Running shoes",  done: true },
        { id: "i17", name: "Laptop stand",   done: false },
        { id: "i18", name: "Desk lamp",      done: false },
      ],
    },
    {
      id: "t6", name: "Gym session", subtitle: "Completed", date: fmt(threeDays),
      items: [
        { id: "i19", name: "Warm up 10 mins",  done: true },
        { id: "i20", name: "Chest & shoulders", done: true },
        { id: "i21", name: "Cool down stretch", done: true },
      ],
    },
  ];
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [otpSource, setOtpSource] = useState('signup');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const authSlideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const notificationMapRef = useRef({});
  const notificationListener = useRef();
  const responseListener = useRef();

  const navigateToTasks = (group) => {
    setSelectedGroup(group);
    slideAnim.setValue(SCREEN_WIDTH);
    setScreen('tasks');
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const navigateBack = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setScreen('home');
    });
  };

  const navigateToCreate = () => {
    slideAnim.setValue(SCREEN_WIDTH);
    setScreen('createTask');
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const navigateToLogin = () => {
    authSlideAnim.setValue(-SCREEN_WIDTH);
    setScreen('login');
    Animated.timing(authSlideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const navigateToSignUp = () => {
    authSlideAnim.setValue(SCREEN_WIDTH);
    setScreen('signup');
    Animated.timing(authSlideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const navigateToOTP = (source) => {
    authSlideAnim.setValue(-SCREEN_WIDTH);
    setScreen('otp');
    setOtpSource(source);
    Animated.timing(authSlideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const navigateToHome = () => {
    Animated.timing(authSlideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setScreen('home');
      authSlideAnim.setValue(0);
    });
  };

  const handleCreateTask = async (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);

    // Schedule expiry notification
    const notifId = await scheduleTaskExpiryNotification(newTask);
    if (notifId) {
      notificationMapRef.current[newTask.id] = notifId;
    }

    navigateBack();
  };

  const handleDeleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);

    // Cancel scheduled notification
    const notifId = notificationMapRef.current[taskId];
    if (notifId) {
      await cancelTaskNotification(notifId);
      delete notificationMapRef.current[taskId];
    }
  };

  const saveTasksToStorage = async (tasksToSave) => {
    if (user) {
      try {
        await AsyncStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasksToSave));
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    }
  };

  const loadTasksFromStorage = async (userId) => {
    try {
      const storedTasks = await AsyncStorage.getItem(`tasks_${userId}`);
      if (storedTasks) {
        return JSON.parse(storedTasks);
      }
      return buildSampleTasks();
    } catch (error) {
      console.error('Error loading tasks:', error);
      return buildSampleTasks();
    }
  };

  const handleOTPSent = (source) => (userEmail) => {
    setEmail(userEmail);
    navigateToOTP(source);
  };

  const handleOTPVerified = async () => {
    // Create user from email for demo purposes
    const userData = {
      id: `email-${email}`,
      email: email,
      name: email.split('@')[0],
      photo: null,
      idToken: 'email-token',
    };
    setUser(userData);
    const userTasks = await loadTasksFromStorage(userData.id);
    setTasks(userTasks);
    navigateToHome();
  };

  const navigateToAccount = () => {
    slideAnim.setValue(SCREEN_WIDTH);
    setScreen('account');
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSignOut = async () => {
    setUser(null);
    setTasks([]);
    navigateToSignUp();
  };

  // Register for push notifications on mount
  useEffect(() => {
    registerForPushNotifications();

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // Reschedule notifications whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      rescheduleAllTaskNotifications(tasks).then(map => {
        notificationMapRef.current = map;
      });
    }
  }, [tasks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fade out splash, then show signup
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setScreen('signup');
        authSlideAnim.setValue(SCREEN_WIDTH);
        // Fade in signup
        Animated.timing(authSlideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#000' }}>
      {screen === 'splash' && (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: fadeAnim }]}>
          <SplashScreen />
        </Animated.View>
      )}
      {screen === 'signup' && (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', transform: [{ translateX: authSlideAnim }] }]}>
          <SignUpScreen
            onOTPSent={handleOTPSent('signup')}
            onLogin={navigateToLogin}
          />
        </Animated.View>
      )}
      {screen === 'login' && (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', transform: [{ translateX: authSlideAnim }] }]}>
          <LoginScreen
            onOTPSent={handleOTPSent('login')}
            onSignUp={navigateToSignUp}
          />
        </Animated.View>
      )}
      {screen === 'otp' && (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', transform: [{ translateX: authSlideAnim }] }]}>
          <OTPScreen
            email={email}
            onBack={() => {
              if (otpSource === 'signup') {
                navigateToSignUp();
              } else {
                navigateToLogin();
              }
            }}
            onVerified={handleOTPVerified}
            onLogin={navigateToLogin}
          />
        </Animated.View>
      )}
      {(screen === 'home' || screen === 'tasks' || screen === 'createTask' || screen === 'account') && (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]}>
          <HomeScreen
            userEmail={user?.email || ''}
            tasks={tasks}
            onOpenGroup={navigateToTasks}
            onCreateTask={navigateToCreate}
            onDeleteTask={handleDeleteTask}
            onNavigateToAccount={navigateToAccount}
          />
        </Animated.View>
      )}
      {screen === 'tasks' && selectedGroup && (
        <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 10, backgroundColor: '#000', transform: [{ translateX: slideAnim }] }]}>
          <TaskScreen
            dateGroup={selectedGroup}
            onBack={navigateBack}
          />
        </Animated.View>
      )}
      {screen === 'createTask' && (
        <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 10, backgroundColor: '#000', transform: [{ translateX: slideAnim }] }]}>
          <CreateTaskScreen
            onBack={navigateBack}
            onCreate={handleCreateTask}
          />
        </Animated.View>
      )}
      {screen === 'account' && (
        <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 10, backgroundColor: '#000', transform: [{ translateX: slideAnim }] }]}>
          <AccountScreen
            user={user}
            onBack={navigateBack}
            onSignOut={handleSignOut}
          />
        </Animated.View>
      )}
      <StatusBar style="light" />
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
