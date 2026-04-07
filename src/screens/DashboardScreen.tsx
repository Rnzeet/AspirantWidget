import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet, ActivityIndicator, TextInput, Appearance } from 'react-native';
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
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  const [stopwatchVisible, setStopwatchVisible] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const handleStartStop = () => {
    setStopwatchRunning(!stopwatchRunning);
  };

  const handleReset = () => {
    setStopwatchTime(0);
    setStopwatchRunning(false);
  };

  const formatStopwatchTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return [hours, minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });
    return () => sub.remove();
  }, []);

  const formatLocalTime = (isoTime?: string | null) => {
    if (!isoTime) return '-';
    const d = new Date(isoTime);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

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

  const handleToggleTarget = async (examId: string, targetId: string) => {
    try {
      await storageService.completeTarget(examId, targetId);
      const stored = await storageService.getExams();
      setExams(stored);
    } catch (error) {
      console.error('Error toggling target:', error);
    }
  };

  const theme = {
    background: isDarkMode ? '#0d1220' : '#f5f7fa',
    cardBackground: isDarkMode ? '#162039' : '#fff',
        text: isDarkMode ? '#FFFFFF' : '#2c3e50',
    subtitle: isDarkMode ? '#c3d1ed' : '#bdc3c7',
    border: isDarkMode ? '#324163' : '#eaeaea',
    sectionTitle: isDarkMode ? '#b9c8ee' : '#2c3e50',
    buttonBg: isDarkMode ? '#2a3a5f' : '#3498db',
    buttonText: '#fff',
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
  const badgeTextColor = (totalTargets > 0 && completedTargets === totalTargets) ? '#fff' : (isDarkMode ? '#fff' : '#2c3e50');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your exams...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground }] }>
        <Text style={[styles.headerTitle,{ color: theme.text }]}>📚 Exam Aspirant Widget</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[styles.headerSubtitle,{ color: theme.subtitle }]}>Your Daily Study Companion</Text>
          <Pressable
            style={[styles.themeToggle, { backgroundColor: theme.buttonBg }]}
            onPress={() => setIsDarkMode(prev => !prev)}
          >
            <Text style={[styles.themeToggleText, { color: theme.buttonText }]}>
              {isDarkMode ? 'Light' : 'Dark'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={[styles.statsContainer, { backgroundColor: theme.background }] }>
        <View style={[styles.statBox, { backgroundColor: theme.cardBackground }] }>
          <Text style={[styles.statNumber, { color: theme.text }]}>{exams.length}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitle }]}>Exams</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.cardBackground }] }>
          <Text style={[styles.statNumber, { color: theme.text }]}>{totalDaysStudying}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitle }]}>Total Streak</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.cardBackground }] }>
          <Text style={[styles.statNumber, { color: theme.text }]}>{criticalExams}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitle }]}>Critical</Text>
        </View>
        <Pressable style={[styles.statBox, { backgroundColor: theme.cardBackground }]} onPress={() => setShowTargetsModal(true)}>
          <Text style={[styles.statNumber, { color: theme.text }]}>{totalTargets}</Text>
          <Text style={[styles.statLabel, { color: theme.subtitle }]}>Targets</Text>
        </Pressable>
      </View>

      {/* Exams List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>📅 Your Exams</Text>
          <Pressable style={styles.stopwatchButton} onPress={() => setStopwatchVisible(true)}>
            <Text style={styles.stopwatchButtonText}>Stopwatch</Text>
          </Pressable>
        </View>
        {exams.length > 0 ? (
          exams.map(exam => (
            <ExamItem
              key={exam.id}
              exam={exam}
              onDelete={handleDeleteExam}
              onUpdateExam={handleUpdateExam}
              onToggleTarget={handleToggleTarget}
              isDarkMode={isDarkMode}
            />
          ))
        ) : (
          <Text style={[styles.emptyText, { color: theme.subtitle }]}>No exams added yet. Start by adding one! 🎯</Text>
        )}
      </ScrollView>

      {/* Add Exam Button */}
      <Pressable style={[styles.addButton, { backgroundColor: isDarkMode ? '#2a3a5f' : '#3498db' }]} onPress={() => setShowAddModal(true)}>
        <Text style={[styles.addButtonText, { color: '#fff' }]}>+ Add Exam</Text>
      </Pressable>

      {/* Add Exam Modal */}
      <AddExamModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddExam={handleAddExam}
      />

      {/* Stopwatch Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stopwatchVisible}
        onRequestClose={() => setStopwatchVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.stopwatchTime}>{formatStopwatchTime(stopwatchTime)}</Text>
            <View style={styles.stopwatchControls}>
              <Pressable style={styles.stopwatchControlButton} onPress={handleStartStop}>
                <Text style={styles.stopwatchControlButtonText}>{stopwatchRunning ? 'Stop' : 'Start'}</Text>
              </Pressable>
              <Pressable style={styles.stopwatchControlButton} onPress={handleReset}>
                <Text style={styles.stopwatchControlButtonText}>Reset</Text>
              </Pressable>
            </View>
            <Pressable style={styles.stopwatchCloseButton} onPress={() => setStopwatchVisible(false)}>
              <Text style={styles.stopwatchCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Targets Modal */}
      <Modal visible={showTargetsModal} animationType="slide">
        <View style={[modalStyles.container, { backgroundColor: isDarkMode ? '#0d1220' : '#f5f7fa' }] }>
          <View style={[modalStyles.header, { backgroundColor: isDarkMode ? '#1f2d4b' : '#2c3e50' }]}>
            <View style={modalStyles.headerLeft}>
              <Text style={[modalStyles.title, { color: isDarkMode ? '#fff' : '#fff' }]}>All Daily Targets</Text>
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
                <Text style={[modalStyles.examTitle,{ color: isDarkMode ? '#e1ecff' : '#2c3e50' }]}>{exam.name}</Text>
                {exam.dailyTargets.length === 0 ? (
                  <Text style={[modalStyles.noTargets,{ color: isDarkMode ? '#c3d1ed' : '#95a5a6' }]}>No targets for this exam.</Text>
                ) : (
                  exam.dailyTargets.map(target => (
                    <View key={target.id} style={[modalStyles.targetRow, { justifyContent: 'space-between' }]}>
                      <Pressable
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => handleToggleTarget(exam.id, target.id)}
                      >
                        <Text style={[modalStyles.check, target.completed && modalStyles.checkDone, { color: isDarkMode ? (target.completed ? '#4CAF50' : '#fff') : (target.completed ? '#4CAF50' : '#999') }]}>
                          {target.completed ? '✓' : '○'}
                        </Text>
                                                {editingExamId === exam.id && editingTargetId === target.id ? (
                          <TextInput
                            style={[modalStyles.editInput, { color: theme.text }]}
                            value={editingText}
                            onChangeText={setEditingText}
                            placeholder="Edit target"
                            placeholderTextColor={theme.subtitle}
                          />
                        ) : (
                          <Text style={[modalStyles.targetText, target.completed && modalStyles.targetTextDone, { color: isDarkMode ? (target.completed ? theme.subtitle : theme.text) : (target.completed ? '#999' : '#333') }]}>
                            {target.title}
                          </Text>
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
  themeToggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  themeToggleText: {
    fontWeight: '700',
    fontSize: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  stopwatchButton: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  stopwatchButtonText: {
    color: '#fff',
    fontWeight: '700',
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  stopwatchTime: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'red'
  },
  stopwatchControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stopwatchControlButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  stopwatchControlButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  stopwatchCloseButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  stopwatchCloseButtonText: {
    color: '#fff',
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
