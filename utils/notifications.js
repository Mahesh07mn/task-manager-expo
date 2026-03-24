import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const registerForPushNotifications = async () => {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications work best on a physical device');
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return false;
    }

    // Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('task-expiry', {
        name: 'Task Expiry',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.log('Notification registration error (non-fatal):', error.message);
    return false;
  }
};

// Schedule a push notification for task expiry
export const scheduleTaskExpiryNotification = async (task) => {
  if (!task.dateTime) return null;

  const expiryDate = new Date(task.dateTime);
  const now = new Date();

  // Don't schedule if already expired
  if (expiryDate <= now) return null;

  const secondsUntilExpiry = Math.floor((expiryDate - now) / 1000);

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Expired!',
        body: `"${task.name}" has expired.`,
        data: { taskId: task.id },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'task-expiry' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilExpiry,
        repeats: false,
      },
    });

    console.log(`Notification scheduled for "${task.name}" in ${secondsUntilExpiry}s (id: ${notificationId})`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel a scheduled notification
export const cancelTaskNotification = async (notificationId) => {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

// Reschedule notifications for all tasks (e.g. on app startup)
export const rescheduleAllTaskNotifications = async (tasks) => {
  await cancelAllNotifications();

  const notificationMap = {};
  for (const task of tasks) {
    const notifId = await scheduleTaskExpiryNotification(task);
    if (notifId) {
      notificationMap[task.id] = notifId;
    }
  }
  return notificationMap;
};

// Calculate expiry info for display
export const getExpiryInfo = (task) => {
  if (!task.dateTime) return { expired: false, label: '' };

  const expiryDate = new Date(task.dateTime);
  const now = new Date();
  const diff = expiryDate - now;

  if (diff <= 0) {
    return { expired: true, label: 'Expired' };
  }

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return { expired: false, label: `Expires in ${days}d ${hours % 24}h` };
  if (hours > 0) return { expired: false, label: `Expires in ${hours}h ${minutes % 60}m` };
  if (minutes > 0) return { expired: false, label: `Expires in ${minutes}m` };
  return { expired: false, label: 'Expires soon' };
};
