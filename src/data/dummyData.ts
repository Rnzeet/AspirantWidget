import { Exam } from './types';

export const DUMMY_EXAMS: Exam[] = [
  {
    id: 'e1',
    name: 'SSC CGL',
    date: '2026-06-15T10:00:00',
    category: 'SSC',
    description: 'Combined Graduate Level Examination',
    studyStreak: 5,
    lastStudiedDate: '2026-03-24',
    motivation: 'You\'re doing great! Keep up the momentum 🚀',
    dailyTargets: [
      { id: 't1', title: 'Complete 2 chapters in Quant', completed: true, dueDate: '2026-03-24' },
      { id: 't2', title: 'Revise English Grammar', completed: false, dueDate: '2026-03-24' },
      { id: 't3', title: 'Solve 50 practice questions', completed: true, dueDate: '2026-03-24' },
    ],
  },
  {
    id: 'e2',
    name: 'RBI Grade B',
    date: '2026-04-25T14:30:00',
    category: 'RBI',
    description: 'Officer (General) - Grade B',
    studyStreak: 12,
    lastStudiedDate: '2026-03-23',
    motivation: 'Only 32 days left! Final push ahead! 💪',
    dailyTargets: [
      { id: 't4', title: 'Study Monetary Policy notes', completed: true, dueDate: '2026-03-24' },
      { id: 't5', title: 'Mock test - Economics', completed: true, dueDate: '2026-03-24' },
    ],
  },
  {
    id: 'e3',
    name: 'UPSC CSE',
    date: '2026-05-20T09:00:00',
    category: 'UPSC',
    description: 'Civil Services Examination',
    studyStreak: 2,
    lastStudiedDate: '2026-03-22',
    motivation: 'Start strong today! 🎯',
    dailyTargets: [
      { id: 't6', title: 'Read newspaper - Editorial', completed: false, dueDate: '2026-03-24' },
      { id: 't7', title: 'Revise History Chapter 5', completed: false, dueDate: '2026-03-24' },
      { id: 't8', title: 'Answer 5 essay questions', completed: false, dueDate: '2026-03-24' },
    ],
  },
];
