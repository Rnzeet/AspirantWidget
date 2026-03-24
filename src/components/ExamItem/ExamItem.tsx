import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { Exam } from '../../data/types';
import { calculateCountdown, getUrgencyLevel, formatCountdownText, getAlert } from '../../utils/countdownUtils';
import { styles } from './styles';

type ExamItemProps = {
  exam: Exam;
  onDelete?: (id: string) => void;
};

const ExamItem: React.FC<ExamItemProps> = ({ exam, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const countdown = calculateCountdown(exam.date);
  const urgency = getUrgencyLevel(countdown.totalDays);
  const alert = getAlert(countdown.totalDays);
  const countdownText = formatCountdownText(countdown.days, countdown.hours);

  const completedTargets = exam.dailyTargets.filter(t => t.completed).length;
  const totalTargets = exam.dailyTargets.length;

  const examDate = new Date(exam.date);

  return (
    <Pressable
      style={[styles.card, { borderLeftColor: urgency.color }]}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <View style={styles.container}>
        {/* Main Card Header */}
        <View style={styles.headerContainer}>
          <View style={styles.examInfoContainer}>
            <Text style={styles.examName}>{exam.name}</Text>
            <Text style={styles.examDescription}>{exam.description}</Text>
            <Text style={styles.examDate}>{examDate.toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</Text>
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
                  <Text style={[styles.targetCheckmark, target.completed && styles.completed]}>
                    {target.completed ? '✓' : '○'}
                  </Text>
                  <Text style={[styles.targetText, target.completed && styles.targetCompleted]}>
                    {target.title}
                  </Text>
                </View>
              ))}
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
