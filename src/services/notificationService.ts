import PushNotification from 'react-native-push-notification';
import { Exam } from '../data/types';

// Configure notification settings (local notifications only for development)
export const initializeNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('Notification received:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
      requestPermissions: false,
    // Disable Firebase for development - using local notifications only
    senderID: null,
  });

  // Create notification channel for Android
  PushNotification.createChannel(
    {
      channelId: "exam-reminders",
      channelName: "Exam Reminders",
      channelDescription: "Notifications for exam preparation and reminders",
      playSound: true,
      soundName: "default",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );
};

export const notificationService = {
  // Schedule exam reminder
  scheduleExamReminder: (exam: Exam, minutesBefore: number = 1440) => {
    const examDate = new Date(exam.date);
    const reminderDate = new Date(examDate.getTime() - minutesBefore * 60000);
    const now = new Date();

    if (reminderDate > now) {
      PushNotification.localNotificationSchedule({
        channelId: "exam-reminders",
        title: '📚 Exam Reminder',
        message: `Your ${exam.name} exam is coming up!`,
        date: reminderDate,
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
        bigText: `Don't forget! ${exam.name} is scheduled for ${examDate.toLocaleDateString()}`,
        playSound: true,
        soundName: 'default',
        vibrate: true,
      });
    }
  },

  // Schedule daily motivation alert
  scheduleDailyMotivation: (exam: Exam, hour: number = 8, minute: number = 0) => {
    const motivationalMessages = [
      `Keep going with ${exam.name} prep! 💪`,
      `Today's a great day to study for ${exam.name}! 📖`,
      `You're doing amazing! Let's crush ${exam.name}! 🔥`,
      `One day closer to your ${exam.name} success! 🎯`,
      `Your consistent efforts will pay off! ${exam.name} awaits! ✨`,
    ];

    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hour, minute, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledDate < now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      channelId: "exam-reminders",
      title: '🎓 Daily Study Reminder',
      message: message,
      date: scheduledDate,
      repeatType: 'day',
      smallIcon: 'ic_launcher',
      playSound: true,
      soundName: 'default',
      vibrate: true,
    });
  },

  // Schedule critical alert (when < 7 days left)
  scheduleAlertCritical: (exam: Exam) => {
    const daysLeft = Math.floor(
      (new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 7 && daysLeft > 0) {
      const alertDate = new Date();
      alertDate.setHours(9, 0, 0);

      PushNotification.localNotificationSchedule({
        channelId: "exam-reminders",
        title: '🚨 Critical: Exam Approaching!',
        message: `Only ${daysLeft} days left for ${exam.name}! Final sprint!`,
        date: alertDate,
        smallIcon: 'ic_launcher',
        bigText: `Your ${exam.name} is in ${daysLeft} days. Make every moment count! 💪`,
        playSound: true,
        soundName: 'default',
        vibrate: true,
        vibration: [0, 250, 250, 250],
      });
    }
  },

  // Schedule target completion alert
  scheduleTargetReminder: (examName: string, targetTitle: string, time: Date) => {
    PushNotification.localNotificationSchedule({
      channelId: "exam-reminders",
      title: '📋 Target Reminder',
      message: `Don't forget: ${targetTitle}`,
      date: time,
      smallIcon: 'ic_launcher',
      bigText: `For ${examName}: ${targetTitle}`,
      playSound: true,
      soundName: 'default',
      vibrate: true,
    });
  },

  // Cancel all notifications
  cancelAllNotifications: () => {
    PushNotification.cancelAllLocalNotifications();
  },

  // Get scheduled notifications
  getScheduledNotifications: (callback: any) => {
    PushNotification.getScheduledLocalNotifications(callback);
  },
};

