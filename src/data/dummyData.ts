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
 
];
