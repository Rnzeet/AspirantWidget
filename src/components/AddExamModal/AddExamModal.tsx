import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Exam, ExamCategory } from '../../data/types';

type AddExamModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddExam: (exam: Exam) => void;
};

const EXAM_CATEGORIES: ExamCategory[] = ['SSC', 'UPSC', 'Banking', 'RBI', 'Other'];

// Simple UUID generator
const generateId = () => {
  return 'exam_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const AddExamModal: React.FC<AddExamModalProps> = ({ visible, onClose, onAddExam }) => {
  const [examName, setExamName] = useState('');
  const [description, setDescription] = useState('');
  const [examDate, setExamDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('SSC');
  const [motivation, setMotivation] = useState('');

  const handleAddExam = () => {
    if (!examName.trim()) {
      Alert.alert('Error', 'Please enter exam name');
      return;
    }

    if (!examDate.trim()) {
      Alert.alert('Error', 'Please enter exam date');
      return;
    }

    // Parse date - handle YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(examDate)) {
      Alert.alert('Error', 'Please use format: YYYY-MM-DD');
      return;
    }

    // Create full date string with time
    const fullDateString = examDate + 'T10:00:00';
    const parsedDate = new Date(fullDateString);
    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Error', 'Invalid date');
      return;
    }

    const newExam: Exam = {
      id: generateId(),
      name: examName.trim(),
      date: fullDateString,
      category: selectedCategory,
      description: description.trim() || undefined,
      motivation: motivation.trim() || undefined,
      dailyTargets: [],
      studyStreak: 0,
      lastStudiedDate: undefined,
    };

    onAddExam(newExam);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setExamName('');
    setDescription('');
    setExamDate('');
    setSelectedCategory('SSC');
    setMotivation('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Add New Exam</Text>
          <Pressable onPress={handleAddExam}>
            <Text style={styles.addButtonHeader}>Add</Text>
          </Pressable>
        </View>

        {/* Form */}
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Exam Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Exam Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., SSC CGL, UPSC CSE"
              value={examName}
              onChangeText={setExamName}
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {EXAM_CATEGORIES.map(category => (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Exam Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Exam Date * (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-06-15"
              value={examDate}
              onChangeText={setExamDate}
              keyboardType="default"
              placeholderTextColor="#ccc"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Officer (General) Grade B"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#ccc"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Motivation */}
          <View style={styles.section}>
            <Text style={styles.label}>Daily Motivation</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., You're doing great! Keep pushing!"
              value={motivation}
              onChangeText={setMotivation}
              placeholderTextColor="#ccc"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>💡 Tip: You can add daily targets after creating the exam!</Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => {
              resetForm();
              onClose();
            }}
          >
            <Text style={styles.buttonTextSecondary}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleAddExam}
          >
            <Text style={styles.buttonTextPrimary}>Create Exam</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  cancelButton: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  addButtonHeader: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e8eef2',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
  },
  buttonSecondary: {
    backgroundColor: '#ecf0f1',
  },
  buttonTextPrimary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },
});

export default AddExamModal;
