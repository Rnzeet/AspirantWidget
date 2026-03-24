import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { Exam } from '../../data/types';

type ProgressAnalyticsProps = {
  exams: Exam[];
};

interface DailyProgress {
  date: string;
  completedTargets: number;
  totalTargets: number;
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ exams }) => {
  const screenWidth = Dimensions.get('window').width;

  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalTargets = exams.reduce((acc, exam) => acc + exam.dailyTargets.length, 0);
    const completedTargets = exams.reduce(
      (acc, exam) => acc + exam.dailyTargets.filter(t => t.completed).length,
      0
    );
    const completionRate = totalTargets > 0 ? (completedTargets / totalTargets) * 100 : 0;

    const totalStreak = exams.reduce((acc, exam) => acc + exam.studyStreak, 0);
    const avgStreak = exams.length > 0 ? totalStreak / exams.length : 0;

    return {
      totalTargets,
      completedTargets,
      completionRate,
      totalStreak,
      avgStreak,
    };
  }, [exams]);

  // Prepare streak data for bar chart
  const streakChartData = useMemo(() => {
    return {
      labels: exams.slice(0, 5).map(e => e.name.substring(0, 6)),
      datasets: [
        {
          data: exams.slice(0, 5).map(e => e.studyStreak),
        },
      ],
    };
  }, [exams]);

  // Prepare target completion data
  const targetCompletionData = useMemo(() => {
    const data = exams.map(exam => {
      const completed = exam.dailyTargets.filter(t => t.completed).length;
      const total = exam.dailyTargets.length;
      return total > 0 ? completed / total : 0;
    });

    return {
      labels: exams.slice(0, 4).map(e => e.name.substring(0, 8)),
      data: data.slice(0, 4),
    };
  }, [exams]);

  // Prepare line chart data for exam progress
  const examProgressData = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const data: number[] = [];

    exams.forEach(exam => {
      const examDate = new Date(exam.date);
      const daysLeft = Math.floor(
        (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft >= 0) {
        labels.push(exam.name.substring(0, 8));
        data.push(Math.max(0, 100 - (daysLeft > 90 ? 100 : (daysLeft / 90) * 100)));
      }
    });

    return {
      labels: labels.length > 0 ? labels : ['No Data'],
      datasets: [
        {
          data: data.length > 0 ? data : [0],
        },
      ],
    };
  }, [exams]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>📊 Study Progress Analytics</Text>

      {/* Summary Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completion Rate</Text>
          <Text style={styles.statValue}>
            {stats.completionRate.toFixed(0)}%
          </Text>
          <Text style={styles.statSubtitle}>
            {stats.completedTargets}/{stats.totalTargets}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Streak</Text>
          <Text style={styles.statValue}>🔥 {stats.totalStreak}</Text>
          <Text style={styles.statSubtitle}>days</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg. Streak</Text>
          <Text style={styles.statValue}>{stats.avgStreak.toFixed(1)}</Text>
          <Text style={styles.statSubtitle}>per exam</Text>
        </View>
      </View>

      {/* Study Streak Chart */}
      {exams.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>🔥 Study Streaks by Exam</Text>
          <BarChart
            data={streakChartData}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.7,
              useShadowColorFromDataset: false,
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* Target Completion Progress */}
      {targetCompletionData.labels.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>✅ Target Completion Rate</Text>
          <ProgressChart
            data={targetCompletionData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.7,
              useShadowColorFromDataset: false,
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* Exam Readiness Chart */}
      {examProgressData.labels.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📖 Exam Readiness Progress</Text>
          <LineChart
            data={examProgressData}
            width={screenWidth - 32}
            height={220}
            yAxisLabel=""
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
              strokeWidth: 2,
              useShadowColorFromDataset: false,
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* Empty State */}
      {exams.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>📊 Add exams to see analytics</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#bdc3c7',
    fontWeight: '500',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 10,
    marginVertical: 8,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#95a5a6',
    fontWeight: '500',
  },
});

export default ProgressAnalytics;
