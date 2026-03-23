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

// ─── Sample tasks (replace with API data later) ───────────────────────────────
const buildSampleTasks = () => {
  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const twoDays   = new Date(today); twoDays.setDate(today.getDate() - 2);
  const threeDays = new Date(today); threeDays.setDate(today.getDate() - 3);

  const fmt = (d) => d.toISOString().split("T")[0];

  return [
    {
      id: "t1", name: "House grocery", subtitle: "Expires at 8:52 AM", date: fmt(today),
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

  const handleCreateTask = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    navigateBack();
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
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
    setOtpSource(source);
    setScreen('otp');
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
    setScreen('home');
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
    setScreen('signup');
  };

  useEffect(() => {
    const timer = setTimeout(() => setScreen('signup'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'signup' && (
        <SignUpScreen
          onOTPSent={handleOTPSent('signup')}
          onLogin={() => setScreen('login')}
        />
      )}
      {screen === 'login' && (
        <LoginScreen
          onOTPSent={handleOTPSent('login')}
          onSignUp={() => setScreen('signup')}
        />
      )}
      {screen === 'otp' && (
        <OTPScreen
          email={email}
          onBack={() => setScreen(otpSource)}
          onVerified={handleOTPVerified}
          onLogin={() => setScreen('login')}
        />
      )}
      {(screen === 'home' || screen === 'tasks' || screen === 'createTask' || screen === 'account') && (
        <HomeScreen
          userEmail={user?.email || ''}
          tasks={tasks}
          onOpenGroup={navigateToTasks}
          onCreateTask={navigateToCreate}
          onDeleteTask={handleDeleteTask}
          onNavigateToAccount={navigateToAccount}
        />
      )}
      {screen === 'tasks' && selectedGroup && (
        <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 10, transform: [{ translateX: slideAnim }] }]}>
          <TaskScreen
            dateGroup={selectedGroup}
            onBack={navigateBack}
          />
        </Animated.View>
      )}
      {screen === 'createTask' && (
        <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 10, transform: [{ translateX: slideAnim }] }]}>
          <CreateTaskScreen
            onBack={navigateBack}
            onCreate={handleCreateTask}
          />
        </Animated.View>
      )}
      {screen === 'account' && (
        <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 10, transform: [{ translateX: slideAnim }] }]}>
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
