import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
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
  const [showTargetsModal, setShowTargetsModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize notifications
        initializeNotifications();

        // Load exams from storage
        const storedExams = await storageService.getExams();

        // Reset daily targets once per day if needed
        await storageService.resetDailyTargetsIfNeeded();

        // reload after reset
        const afterResetExams = await storageService.getExams();
        
        if (afterResetExams.length === 0) {
          // First time - use dummy data
          await storageService.saveExams(DUMMY_EXAMS);
          setExams(DUMMY_EXAMS);
        } else {
          setExams(afterResetExams);
        }

        // Schedule notifications for all exams
        (afterResetExams).forEach(exam => {
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

  const handleUpdateExam = async (updatedExam: Exam) => {
    try {
      await storageService.updateExam(updatedExam);
      const stored = await storageService.getExams();
      setExams(stored);
    } catch (error) {
      console.error('Error updating exam:', error);
    }
  };

  const totalDaysStudying = exams.reduce((acc, exam) => acc + exam.studyStreak, 0);
  const criticalExams = exams.filter(e => {
    const now = new Date();
    const examDate = new Date(e.date);
    const daysLeft = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysLeft > 0 && daysLeft <= 30;
  }).length;
  const totalTargets = exams.reduce((acc, exam) => acc + exam.dailyTargets.length, 0);
  const completedTargets = exams.reduce(
    (acc, exam) => acc + exam.dailyTargets.filter(t => t.completed).length,
    0
  );
  const targetsPercent = totalTargets > 0 ? Math.round((completedTargets / totalTargets) * 100) : 0;
  const badgeBgColor = totalTargets === 0 ? '#95a5a6' : (completedTargets === totalTargets ? '#4CAF50' : (completedTargets > 0 ? '#FFC107' : '#bdc3c7'));
  const badgeTextColor = (totalTargets > 0 && completedTargets === totalTargets) ? '#fff' : '#2c3e50';

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
        <Pressable style={styles.statBox} onPress={() => setShowTargetsModal(true)}>
          <Text style={styles.statNumber}>{totalTargets}</Text>
          <Text style={styles.statLabel}>Targets</Text>
        </Pressable>
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
              onUpdateExam={handleUpdateExam}
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

      {/* Targets Modal */}
      <Modal visible={showTargetsModal} animationType="slide">
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <View style={modalStyles.headerLeft}>
              <Text style={modalStyles.title}>All Daily Targets</Text>
              <View style={[modalStyles.badge, { backgroundColor: badgeBgColor }] }>
                <Text style={[modalStyles.badgeText, { color: badgeTextColor }]}>{completedTargets}/{totalTargets} · {targetsPercent}%</Text>
              </View>
            </View>
            <Pressable onPress={() => setShowTargetsModal(false)}>
              <Text style={modalStyles.close}>Close</Text>
            </Pressable>
          </View>
          <ScrollView style={modalStyles.list}>
            {exams.map(exam => (
              <View key={exam.id} style={modalStyles.examSection}>
                <Text style={modalStyles.examTitle}>{exam.name}</Text>
                {exam.dailyTargets.length === 0 ? (
                  <Text style={modalStyles.noTargets}>No targets for this exam.</Text>
                ) : (
                  exam.dailyTargets.map(target => (
                    <View key={target.id} style={[modalStyles.targetRow, { justifyContent: 'space-between' }]}>
                      <Pressable
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                          // toggle and persist via handleUpdateExam
                          const updated = { ...exam } as Exam;
                          updated.dailyTargets = updated.dailyTargets.map(t =>
                            t.id === target.id ? { ...t, completed: !t.completed } : t
                          );
                          handleUpdateExam(updated);
                        }}
                      >
                        <Text style={[modalStyles.check, target.completed && modalStyles.checkDone]}>
                          {target.completed ? '✓' : '○'}
                        </Text>
                        {editingExamId === exam.id && editingTargetId === target.id ? (
                          <TextInput
                            style={modalStyles.editInput}
                            value={editingText}
                            onChangeText={setEditingText}
                            placeholder="Edit target"
                          />
                        ) : (
                          <Text style={[modalStyles.targetText, target.completed && modalStyles.targetTextDone]}>{target.title}</Text>
                        )}
                      </Pressable>

                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {editingExamId === exam.id && editingTargetId === target.id ? (
                          <>
                            <Pressable
                              style={[modalStyles.editBtn]}
                              onPress={async () => {
                                const newTitle = editingText ? editingText.trim() : '';
                                if (newTitle) {
                                  const updated = { ...exam } as Exam;
                                  updated.dailyTargets = updated.dailyTargets.map(t => t.id === target.id ? { ...t, title: newTitle } : t);
                                  await handleUpdateExam(updated);
                                }
                                setEditingExamId(null);
                                setEditingTargetId(null);
                                setEditingText('');
                              }}
                            >
                              <Text style={modalStyles.editBtnText}>Save</Text>
                            </Pressable>
                            <Pressable
                              style={[modalStyles.deleteBtn]}
                              onPress={() => {
                                setEditingExamId(null);
                                setEditingTargetId(null);
                                setEditingText('');
                              }}
                            >
                              <Text style={modalStyles.deleteBtnText}>Cancel</Text>
                            </Pressable>
                          </>
                        ) : (
                          <>
                            <Pressable
                              style={[modalStyles.editBtn]}
                              onPress={() => {
                                setEditingExamId(exam.id);
                                setEditingTargetId(target.id);
                                setEditingText(target.title);
                              }}
                            >
                              <Text style={modalStyles.editBtnText}>Edit</Text>
                            </Pressable>
                            <Pressable
                              style={[modalStyles.deleteBtn]}
                              onPress={() => {
                                const updated = { ...exam } as Exam;
                                updated.dailyTargets = updated.dailyTargets.filter(t => t.id !== target.id);
                                handleUpdateExam(updated);
                              }}
                            >
                              <Text style={modalStyles.deleteBtnText}>Del</Text>
                            </Pressable>
                          </>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
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

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  close: {
    color: '#2ecc71',
    fontWeight: '700',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 10,
  },
  badgeText: {
    color: '#2c3e50',
    fontWeight: '800',
    fontSize: 12,
  },
  list: {
    padding: 16,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    minWidth: 120,
    marginRight: 8,
    color:"black"
  },
  examSection: {
    marginBottom: 20,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
  },
  noTargets: {
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  check: {
    width: 28,
    fontSize: 16,
    color: '#999',
    marginRight: 8,
  },
  checkDone: {
    color: '#4CAF50',
  },
  targetText: {
    fontSize: 14,
    color: '#333',
  },
  targetTextDone: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  editBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#ffebee',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#F44336',
    fontWeight: '700',
  },
});

export default DashboardScreen;
