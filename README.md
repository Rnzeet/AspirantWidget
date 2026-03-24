# 🎓 Exam Aspirant Widget

A comprehensive React Native app for government exam aspirants to track exam countdowns, daily targets, study streaks, and receive smart notifications.

## ✨ Features

- 📅 **Smart Countdown** - Color-coded urgency (🟢 >60d, 🟡 30-60d, 🔴 <30d)
- 📋 **Daily Targets** - Track daily study goals with completion status
- 🔥 **Study Streak** - Monitor consecutive study days
- 🎯 **Smart Alerts** - Context-aware motivational messages & reminders
- 📊 **Progress Analytics** - Beautiful charts showing exam progress
- 🏠 **Home Screen Widgets** - Android & iOS native widgets for quick access
- 🔔 **Push Notifications** - Daily motivation, exam reminders, critical alerts
- 💾 **Data Persistence** - All exams saved locally with AsyncStorage
- 📚 **Multi-Exam Support** - Track SSC, UPSC, Banking, RBI, and more

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- React Native 0.72.7+
- Android SDK (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone and install dependencies:**
```bash
cd AspirantWidget
npm install
```

2. **Install pods (iOS only):**
```bash
cd ios && pod install && cd ..
```

3. **Configure notifications** (see FEATURE_GUIDE.md for details)

4. **Run the app:**

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 📱 App Structure

```
src/
├── components/
│   ├── AddExamModal/       # Add exam form
│   ├── ExamItem/           # Exam card component
│   └── ProgressAnalytics/  # Charts & analytics
├── screens/
│   └── DashboardScreen.tsx # Main dashboard
├── services/
│   ├── storageService.ts   # AsyncStorage operations
│   └── notificationService.ts  # Push notifications
├── data/
│   ├── types.ts            # TypeScript interfaces
│   └── dummyData.ts        # Sample data
└── utils/
    └── countdownUtils.ts   # Countdown calculations
```

## 🎯 Key Features Explained

### Smart Countdown
- Shows days and hours remaining
- Auto-updates daily
- Color changes based on urgency
- Includes smart motivational alerts

### Daily Targets
- Add study goals for each exam
- Mark targets as completed
- Track completion percentage
- Get reminders for uncompleted targets

### Study Streak
- Track consecutive study days per exam
- Motivational 🔥 display
- Helps build study consistency
- Auto-calculated from lastStudiedDate

### Push Notifications
- Daily motivation at 8 AM
- Exam reminders 24 hours before
- Critical alerts when < 7 days left
- Custom target reminders

### Home Screen Widgets
**Android:**
- Colorful countdown display
- Streak counter
- Tap to open app
- Hourly auto-update

**iOS:**
- WidgetKit support
- Small & Medium sizes
- Real-time updates
- Beautiful UI

### Analytics Dashboard
- Study streak comparison
- Target completion rate
- Exam readiness progress
- Summary statistics

## 💾 Data Persistence

All data is automatically saved to device storage:
- Exams and their details
- Daily targets
- Study streaks
- Progress data

No internet connection required after initial setup!

## 📖 Detailed Setup

For comprehensive setup instructions including:
- Native widget configuration
- Push notification setup
- Android & iOS specific configuration
- Firebase setup for production

See [FEATURE_GUIDE.md](FEATURE_GUIDE.md)

## 🔧 Development

### Available Scripts

```bash
npm start          # Start development server
npm run android    # Build and run on Android
npm run ios       # Build and run on iOS
npm test          # Run tests
npm run lint      # Run ESLint
```

### Technologies Used

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type safety
- **AsyncStorage** - Local data persistence
- **React Native Push Notification** - Push alerts
- **React Native Chart Kit** - Beautiful charts
- **WidgetKit** (iOS) - Native widgets
- **AppWidget** (Android) - Native widgets

## 📚 Exam Categories Supported

- 🎓 **SSC** - Staff Selection Commission
- 🏛️ **UPSC** - Union Public Service Commission
- 🏦 **Banking** - IBPS, SBI, etc.
- 🏦 **RBI** - Reserve Bank of India
- 📝 **Other** - Custom exams

## 🎨 UI/UX Features

- Clean, minimal design
- Color-coded urgency indicators
- Intuitive navigation
- Beautiful gradient backgrounds
- Smooth animations
- Responsive layout

## 🐛 Troubleshooting

**Notifications not working?**
- Check app has notification permissions
- Verify push notification service is initialized
- Check device notification settings

**Widget not updating?**
- Rebuild app with `npm run android/ios`
- Check storage service is working
- Verify widget is registered in manifest

**Data not persisting?**
- Check AsyncStorage permissions
- Verify storage service methods are called
- Check device storage space

## 📝 Example Usage

### Add an Exam
```typescript
const newExam: Exam = {
  id: 'exam_1',
  name: 'SSC CGL 2026',
  date: '2026-06-15T10:00:00',
  category: 'SSC',
  description: 'Combined Graduate Level Examination',
  dailyTargets: [],
  studyStreak: 0,
  motivation: 'You can do this! 💪'
};

await storageService.addExam(newExam);
```

### Schedule Notifications
```typescript
// Daily motivation at 8 AM
notificationService.scheduleDailyMotivation(exam, 8, 0);

// Exam reminder 24 hours before
notificationService.scheduleExamReminder(exam);

// Critical alert for exams within 7 days
notificationService.scheduleAlertCritical(exam);
```

## 🎯 Future Roadmap

- [ ] Cloud sync across devices
- [ ] Social features (share progress)
- [ ] Study session timer
- [ ] Detailed progress reports
- [ ] Mock test integration
- [ ] Notes and resources section
- [ ] Study group features
- [ ] Achievement badges

## 📞 Support

For issues, feature requests, or questions:
1. Check FEATURE_GUIDE.md for detailed documentation
2. Review troubleshooting section
3. Check existing code comments

## 📄 License

This project is created for educational purposes.

---

**Good luck with your exam prep! 🚀📚**
