import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions, TextInput, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Exam } from '../../data/types';
import { calculateCountdown, getUrgencyLevel, formatCountdownText, getAlert } from '../../utils/countdownUtils';
import { styles } from './styles';

type ExamItemProps = {
  exam: Exam;
  onDelete?: (id: string) => void;
  onUpdateExam?: (exam: Exam) => void;
  isDarkMode?: boolean;
};

const ExamItem: React.FC<ExamItemProps> = ({ exam, onDelete, onUpdateExam, isDarkMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const countdown = calculateCountdown(exam.date);
  const urgency = getUrgencyLevel(countdown.totalDays);
  const alert = getAlert(countdown.totalDays);
  const countdownText = formatCountdownText(countdown.days, countdown.hours);

  const completedTargets = exam.dailyTargets.filter(t => t.completed).length;
  const totalTargets = exam.dailyTargets.length;
  const [newTargetTitle, setNewTargetTitle] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const examDate = new Date(exam.date);

  const formatDateYYYYMMDD = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <Pressable
      style={[
        styles.card,
        { borderLeftColor: urgency.color, backgroundColor: isDarkMode ? '#17223d' : '#fff' },
      ]}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <View style={styles.container}>
        {/* Main Card Header */}
        <View style={styles.headerContainer}>
          <View style={styles.examInfoContainer}>
            <Text style={[styles.examName, { color: isDarkMode ? '#e9eeff' : '#1a1a1a' }]}>{exam.name}</Text>
            <Text style={[styles.examDescription, { color: isDarkMode ? '#b8c5e0' : '#666' }]}>{exam.description}</Text>
            <Pressable onPress={() => {
              setDateValue(examDate);
              setShowDatePicker(true);
            }}>
              <Text style={[styles.examDate, { textDecorationLine: 'underline' }]}>{examDate.toLocaleDateString('en-US', { 
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={dateValue || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDateValue(selectedDate);
                    // build ISO date with default time at 10:00
                    const fullDateString = formatDateYYYYMMDD(selectedDate) + 'T10:00:00';
                    const updated = { ...exam } as Exam;
                    updated.date = fullDateString;
                    if (onUpdateExam) onUpdateExam(updated);
                  }
                }}
              />
            )}
          </View>

          {/* Countdown Box */}
          <View style={[styles.countdownBox, { backgroundColor: urgency.color }]}>
            <Text style={styles.urgencyEmoji}>{urgency.emoji}</Text>
            <Text style={styles.countdownDays}>{countdown.days}</Text>
            <Text style={styles.countdownLabel}>Days</Text>
            {countdown.hours > 0 && (
              <Text style={styles.countdownHours}>{countdown.hours}h</Text>
            )}
          </View>
        </View>

        {/* Alert Message */}
        <Text style={styles.alertMessage}>{alert}</Text>

        {/* Study Streak */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>🔥 {exam.studyStreak} Day Streak</Text>
        </View>

        {/* Daily Targets */}
        <View style={styles.targetsSection}>
          <Text style={styles.sectionTitle}>📋 Daily Targets ({completedTargets}/{totalTargets})</Text>
            {isExpanded && (
              <View style={styles.targetsList}>
                {exam.dailyTargets.map(target => (
                  <View key={target.id} style={styles.targetItem}>
                    <Pressable
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                      onPress={() => {
                        // toggle completed
                        const updated = { ...exam } as Exam;
                        updated.dailyTargets = updated.dailyTargets.map(t =>
                          t.id === target.id ? { ...t, completed: !t.completed } : t
                        );
                        if (onUpdateExam) onUpdateExam(updated);
                      }}
                    >
                      <Text style={[styles.targetCheckmark, target.completed && styles.completed]}>
                        {target.completed ? '✓' : '○'}
                      </Text>
                      {editingTargetId === target.id ? (
                        <TextInput
                          style={styles.addTargetInput}
                          value={editingText}
                          onChangeText={setEditingText}
                        />
                      ) : (
                        <Text style={[
                          styles.targetText,
                          target.completed && styles.targetCompleted,
                          { color: isDarkMode ? '#dfe5ff' : '#495057' },
                        ]}>
                          {target.title}
                        </Text>
                      )}
                    </Pressable>
                    {/* Edit / Delete buttons */}
                    {editingTargetId === target.id ? (
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Pressable
                          style={styles.addTargetButton}
                          onPress={() => {
                            const title = editingText.trim();
                            if (!title) {
                              Alert.alert('Error', 'Please enter a target title');
                              return;
                            }
                            const updated = { ...exam } as Exam;
                            updated.dailyTargets = updated.dailyTargets.map(t =>
                              t.id === target.id ? { ...t, title } : t
                            );
                            setEditingTargetId(null);
                            setEditingText('');
                            if (onUpdateExam) onUpdateExam(updated);
                          }}
                        >
                          <Text style={styles.addTargetButtonText}>Save</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.addTargetButton, { backgroundColor: '#ecf0f1' }]}
                          onPress={() => { setEditingTargetId(null); setEditingText(''); }}
                        >
                          <Text style={[styles.addTargetButtonText, { color: '#2c3e50' }]}>Cancel</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Pressable
                          style={styles.addTargetButton}
                          onPress={() => { setEditingTargetId(target.id); setEditingText(target.title); }}
                        >
                          <Text style={styles.addTargetButtonText}>Edit</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.addTargetButton, { backgroundColor: '#ffebee' }]}
                          onPress={() => {
                            const updated = { ...exam } as Exam;
                            updated.dailyTargets = updated.dailyTargets.filter(t => t.id !== target.id);
                            if (onUpdateExam) onUpdateExam(updated);
                          }}
                        >
                          <Text style={[styles.addTargetButtonText, { color: '#F44336' }]}>Del</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                ))}

                {/* Add new target */}
                <View style={styles.addTargetContainer}>
                  <TextInput
                    style={styles.addTargetInput}
                    placeholder="Add new target (e.g., Read Chapter 3)"
                    value={newTargetTitle}
                    onChangeText={setNewTargetTitle}
                  />
                  <Pressable
                    style={styles.addTargetButton}
                    onPress={() => {
                      const title = newTargetTitle.trim();
                      if (!title) {
                        Alert.alert('Error', 'Please enter a target title');
                        return;
                      }
                      const newTarget = {
                        id: 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                        title,
                        completed: false,
                        dueDate: new Date().toISOString(),
                      } as any;
                      const updated = { ...exam } as Exam;
                      updated.dailyTargets = [newTarget, ...updated.dailyTargets];
                      setNewTargetTitle('');
                      if (onUpdateExam) onUpdateExam(updated);
                    }}
                  >
                    <Text style={styles.addTargetButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            )}
        </View>

        {/* Motivation */}
        {exam.motivation && (
          <Text style={styles.motivationText}>💪 {exam.motivation}</Text>
        )}

        {/* Delete Button */}
        {onDelete && (
          <Pressable
            style={styles.deleteButton}
            onPress={() => onDelete(exam.id)}
          >
            <Text style={styles.deleteText}>Delete Exam</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default ExamItem;
