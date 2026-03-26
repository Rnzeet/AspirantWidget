import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExamItem from './ExamItem';
import { Exam } from '../../data/types';

// Mock date for consistent testing
const MOCK_NOW = '2026-03-23T12:00:00.000Z';
jest.useFakeTimers().setSystemTime(new Date(MOCK_NOW));

const baseExam: Exam = {
  id: '1',
  name: 'Test Exam',
  date: new Date().toISOString(),
  dailyTargets: [],
  studyStreak: 0,
  category: 'Other',
  description: 'Test Description',
};

const onDeleteMock = jest.fn();

describe('<ExamItem />', () => {

  it('renders "Past" for an exam that has already occurred', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const exam = { ...baseExam, date: pastDate.toISOString() };

    const { getByText } = render(<ExamItem exam={exam} onDelete={onDeleteMock} />);

    expect(getByText('Past')).toBeTruthy();
    expect(() => getByText(/Left/)).toThrow(); // Unit should be empty
  });

  it('displays remaining days for an exam more than 24 hours away', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const exam = { ...baseExam, date: futureDate.toISOString() };

    const { getByText } = render(<ExamItem exam={exam} onDelete={onDeleteMock} />);

    expect(getByText('2')).toBeTruthy();
    expect(getByText('Days Left')).toBeTruthy();
  });
  
  it('displays "1 Day Left" for an exam between 24 and 48 hours away', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 36);
    const exam = { ...baseExam, date: futureDate.toISOString() };

    const { getByText } = render(<ExamItem exam={exam} onDelete={onDeleteMock} />);

    expect(getByText('1')).toBeTruthy();
    expect(getByText('Day Left')).toBeTruthy();
  });

  it('displays remaining hours for an exam less than 24 hours away', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 5);
    const exam = { ...baseExam, date: futureDate.toISOString() };

    const { getByText } = render(<ExamItem exam={exam} onDelete={onDeleteMock} />);

    expect(getByText('5')).toBeTruthy();
    expect(getByText('Hours Left')).toBeTruthy();
  });
  
    it('displays "1 Hour Left" for an exam less than an hour away', () => {
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 30);
    const exam = { ...baseExam, date: futureDate.toISOString() };

    const { getByText } = render(<ExamItem exam={exam} onDelete={onDeleteMock} />);

    expect(getByText('1')).toBeTruthy();
    expect(getByText('Hour Left')).toBeTruthy();
  });

  it('calls onDelete with the correct id when delete button is pressed', () => {
    const { getByText } = render(<ExamItem exam={baseExam} onDelete={onDeleteMock} />);
    
    fireEvent.press(getByText('✕'));

    expect(onDeleteMock).toHaveBeenCalledWith(baseExam.id);
  });
});
