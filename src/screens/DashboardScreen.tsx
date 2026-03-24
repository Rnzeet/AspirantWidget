import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { Exam } from '../data/types';
import { DUMMY_EXAMS } from '../data/dummyData';
import ExamItem from '../components/ExamItem/ExamItem';
import AddExamModal from '../components/AddExamModal/AddExamModal';
import { storageService } from '../services/storageService';
import { initializeNotifications, notificationService } from '../services/notificationService';

const DashboardScreen = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize notifications
        initializeNotifications();

        // Load exams from storage
        const storedExams = await storageService.getExams();
        
        if (storedExams.length === 0) {
          // First time - use dummy data
          await storageService.saveExams(DUMMY_EXAMS);
          setExams(DUMMY_EXAMS);
        } else {
          setExams(storedExams);
        }

        // Schedule notifications for all exams
        storedExams.forEach(exam => {
          notificationService.scheduleExamReminder(exam);
          notificationService.scheduleAlertCritical(exam);
          notificationService.scheduleDailyMotivation(exam);
        });
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to dummy data
        setExams(DUMMY_EXAMS);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleAddExam = async (newExam: Exam) => {
    try {
      const updated = await storageService.addExam(newExam);
      setExams(updated);

      // Schedule notifications for the new exam
      notificationService.scheduleExamReminder(newExam);
      notificationService.scheduleAlertCritical(newExam);
      notificationService.scheduleDailyMotivation(newExam);
    } catch (error) {
      console.error('Error adding exam:', error);
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      const updated = await storageService.deleteExam(id);
      setExams(updated);
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const totalDaysStudying = exams.reduce((acc, exam) => acc + exam.studyStreak, 0);
  const criticalExams = exams.filter(e => {
    const now = new Date();
    const examDate = new Date(e.date);
    const daysLeft = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysLeft > 0 && daysLeft <= 30;
  }).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your exams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Exam Aspirant Widget</Text>
        <Text style={styles.headerSubtitle}>Your Daily Study Companion</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{exams.length}</Text>
          <Text style={styles.statLabel}>Exams</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalDaysStudying}</Text>
          <Text style={styles.statLabel}>Total Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{criticalExams}</Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
      </View>

      {/* Exams List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>📅 Your Exams</Text>
        {exams.length > 0 ? (
          exams.map(exam => (
            <ExamItem
              key={exam.id}
              exam={exam}
              onDelete={handleDeleteExam}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No exams added yet. Start by adding one! 🎯</Text>
        )}
      </ScrollView>

      {/* Add Exam Button */}
      <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <Text style={styles.addButtonText}>+ Add Exam</Text>
      </Pressable>

      {/* Add Exam Modal */}
      <AddExamModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddExam={handleAddExam}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#bdc3c7',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 16,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#95a5a6',
    fontSize: 14,
    marginTop: 30,
  },
  addButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DashboardScreen;
