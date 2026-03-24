import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exam } from '../data/types';

const EXAMS_STORAGE_KEY = '@aspirant_exams';
const LAST_RESET_KEY = '@aspirant_last_daily_reset';

export const storageService = {
  // Save all exams
  saveExams: async (exams: Exam[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
    } catch (error) {
      console.error('Error saving exams:', error);
      throw error;
    }
  },

  // Get all exams
  getExams: async (): Promise<Exam[]> => {
    try {
      const examsData = await AsyncStorage.getItem(EXAMS_STORAGE_KEY);
      return examsData ? JSON.parse(examsData) : [];
    } catch (error) {
      console.error('Error retrieving exams:', error);
      return [];
    }
  },

  // Add a single exam
  addExam: async (exam: Exam): Promise<Exam[]> => {
    try {
      const exams = await storageService.getExams();
      exams.push(exam);
      await storageService.saveExams(exams);
      return exams;
    } catch (error) {
      console.error('Error adding exam:', error);
      throw error;
    }
  },

  // Update an exam
  updateExam: async (updatedExam: Exam): Promise<Exam[]> => {
    try {
      const exams = await storageService.getExams();
      const index = exams.findIndex(e => e.id === updatedExam.id);
      if (index !== -1) {
        exams[index] = updatedExam;
        await storageService.saveExams(exams);
      }
      return exams;
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  },

  // Delete an exam
  deleteExam: async (examId: string): Promise<Exam[]> => {
    try {
      const exams = await storageService.getExams();
      const filtered = exams.filter(e => e.id !== examId);
      await storageService.saveExams(filtered);
      return filtered;
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  },

  // Update study streak for an exam
  updateStudyStreak: async (examId: string, streak: number, lastDate: string): Promise<void> => {
    try {
      const exams = await storageService.getExams();
      const exam = exams.find(e => e.id === examId);
      if (exam) {
        exam.studyStreak = streak;
        exam.lastStudiedDate = lastDate;
        await storageService.saveExams(exams);
      }
    } catch (error) {
      console.error('Error updating study streak:', error);
      throw error;
    }
  },

  // Mark target as completed
  completeTarget: async (examId: string, targetId: string): Promise<void> => {
    try {
      const exams = await storageService.getExams();
      const exam = exams.find(e => e.id === examId);
      if (exam) {
        const target = exam.dailyTargets.find(t => t.id === targetId);
        if (target) {
          target.completed = true;
          await storageService.saveExams(exams);
        }
      }
    } catch (error) {
      console.error('Error completing target:', error);
      throw error;
    }
  },

  // Clear all data
  clearAllData: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(EXAMS_STORAGE_KEY);
      await AsyncStorage.removeItem(LAST_RESET_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },

  // Reset daily targets once per day (if not already reset today)
  resetDailyTargetsIfNeeded: async (): Promise<void> => {
    try {
      const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);
      const today = new Date().toISOString().split('T')[0];
      if (lastReset === today) return; // already reset today

      const exams = await storageService.getExams();
      let changed = false;
      const updated = exams.map(exam => {
        const resetTargets = exam.dailyTargets.map(t => {
          if (t.completed) {
            changed = true;
            return { ...t, completed: false };
          }
          return t;
        });
        return { ...exam, dailyTargets: resetTargets };
      });

      if (changed) {
        await storageService.saveExams(updated);
      }
      await AsyncStorage.setItem(LAST_RESET_KEY, today);
    } catch (error) {
      console.error('Error resetting daily targets:', error);
      throw error;
    }
  },
};
