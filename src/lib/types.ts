// Core types based on PRD Appendix C: Database Schema

export const GoalType = {
  STRENGTH: 'STRENGTH',
  CARDIO: 'CARDIO',
  BODY: 'BODY',
  HABIT: 'HABIT',
} as const;

export type GoalType = typeof GoalType[keyof typeof GoalType];

export const GoalStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  PAUSED: 'PAUSED',
} as const;

export type GoalStatus = typeof GoalStatus[keyof typeof GoalStatus];

export interface User {
  id: string;
  email?: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  description: string;
  targetDate: Date;
  frequency: string;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
  progress?: Progress[];
}

export interface Progress {
  id: string;
  goalId: string;
  value: number;
  unit: string;
  note?: string;
  recordedAt: Date;
}

// UI-specific types
export interface GoalWithProgress extends Goal {
  currentValue: string;
  progressPercentage: number;
  lastEntry?: string;
  urgent: boolean;
}

export interface ProgressEntry {
  date: string;
  value: number;
  unit: string;
  note?: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
  target: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastUpdated: Date;
}

// Form types
export interface GoalCreationForm {
  type: GoalType;
  description: string;
  targetDate: string;
  frequency: string;
}

export interface ProgressEntryForm {
  goalId: string;
  value: string;
  unit: string;
  note?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Component prop types
export interface GoalCardProps {
  goal: GoalWithProgress;
  onEdit: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  onViewChart: (goalId: string) => void;
}

export interface ProgressChartProps {
  data: ChartData;
  timeRange: '7d' | '1m' | '3m' | 'all';
  onTimeRangeChange: (range: '7d' | '1m' | '3m' | 'all') => void;
}

export interface StreakDisplayProps {
  streak: StreakData;
  className?: string;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Constants
export const GOAL_TYPE_ICONS: Record<GoalType, string> = {
  [GoalType.STRENGTH]: '💪',
  [GoalType.CARDIO]: '🏃‍♂️',
  [GoalType.BODY]: '📏',
  [GoalType.HABIT]: '🎯',
};

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  [GoalType.STRENGTH]: 'Strength',
  [GoalType.CARDIO]: 'Cardio',
  [GoalType.BODY]: 'Body',
  [GoalType.HABIT]: 'Habit',
};

export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: '3x-week', label: '3x per week' },
  { value: '5x-week', label: '5x per week' },
  { value: 'weekly', label: 'Weekly' },
] as const;

export const UNIT_OPTIONS = [
  { value: 'kg', label: 'kg' },
  { value: 'lbs', label: 'lbs' },
  { value: 'km', label: 'km' },
  { value: 'miles', label: 'miles' },
  { value: 'reps', label: 'reps' },
  { value: 'minutes', label: 'minutes' },
  { value: '%', label: '%' },
] as const;

export const TIME_RANGES = [
  { value: '7d' as const, label: '7D' },
  { value: '1m' as const, label: '1M' },
  { value: '3m' as const, label: '3M' },
  { value: 'all' as const, label: 'All' },
];

// Utility types
export type TimeRange = '7d' | '1m' | '3m' | 'all';
export type FrequencyValue = typeof FREQUENCY_OPTIONS[number]['value'];
export type UnitValue = typeof UNIT_OPTIONS[number]['value'];