export type ExamCategory = 'SSC' | 'UPSC' | 'Banking' | 'RBI' | 'Other';

export interface DailyTarget {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  category: ExamCategory;
  description?: string;
  dailyTargets: DailyTarget[];
  studyStreak: number;
  lastStudiedDate?: string;
  motivation?: string;
}

export interface UrgencyLevel {
  level: 'low' | 'medium' | 'high';
  color: string;
  emoji: string;
}
