import { UrgencyLevel } from '../data/types';

export interface CountdownData {
  days: number;
  hours: number;
  totalDays: number;
  isPast: boolean;
}

export const calculateCountdown = (examDate: string): CountdownData => {
  const now = new Date();
  const date = new Date(examDate);
  const diffTime = date.getTime() - now.getTime();

  if (diffTime < 0) {
    return {
      days: 0,
      hours: 0,
      totalDays: 0,
      isPast: true,
    };
  }

  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const remainingTime = diffTime % (1000 * 60 * 60 * 24);
  const hours = Math.ceil(remainingTime / (1000 * 60 * 60));

  return {
    days: totalDays,
    hours: hours,
    totalDays: totalDays,
    isPast: false,
  };
};

export const getUrgencyLevel = (daysLeft: number): UrgencyLevel => {
  if (daysLeft > 60) {
    return {
      level: 'low',
      color: '#4CAF50', // Green
      emoji: '🟢',
    };
  } else if (daysLeft >= 30 && daysLeft <= 60) {
    return {
      level: 'medium',
      color: '#FFC107', // Amber/Yellow
      emoji: '🟡',
    };
  } else {
    return {
      level: 'high',
      color: '#F44336', // Red
      emoji: '🔴',
    };
  }
};

export const formatCountdownText = (days: number, hours: number): string => {
  if (days > 0) {
    return `${days} ${days === 1 ? 'Day' : 'Days'} Left`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'} Left`;
  } else {
    return 'Exam Today!';
  }
};

export const getAlert = (daysLeft: number): string => {
  if (daysLeft < 0) {
    return 'Exam has passed! Great job! 🎉';
  } else if (daysLeft === 0) {
    return 'Exam is today! Go ace it! 💪';
  } else if (daysLeft <= 7) {
    return `Only ${daysLeft} days left! Final sprint! 🚀`;
  } else if (daysLeft <= 30) {
    return `${daysLeft} days left! Revise syllabus now! 📚`;
  } else if (daysLeft <= 60) {
    return `${daysLeft} days left! Stay focused! 🎯`;
  } else {
    return 'You have plenty of time. Consistent efforts lead to success! 📈';
  }
};

export const calculateStudyStreak = (lastStudiedDate: string | undefined, currentStreak: number): number => {
  if (!lastStudiedDate) return currentStreak;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastStudied = new Date(lastStudiedDate);
  lastStudied.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastStudied.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    // Studied today
    return currentStreak;
  } else if (diffDays === 1) {
    // Studied yesterday, increment streak
    return currentStreak + 1;
  } else {
    // Break in streak
    return 1;
  }
};
