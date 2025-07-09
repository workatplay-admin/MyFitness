import { GoalType } from './types';

// Application constants
export const APP_NAME = 'MyFitness';
export const APP_DESCRIPTION = 'The simplest way to reach your fitness goals';
export const APP_VERSION = '1.0.0';

// API constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 10000; // 10 seconds

// Database constants
export const MAX_GOALS_PER_USER = 5;
export const MAX_PROGRESS_ENTRIES_PER_PAGE = 50;
export const MAX_GOAL_DESCRIPTION_LENGTH = 200;
export const MIN_GOAL_DESCRIPTION_LENGTH = 10;
export const MAX_PROGRESS_NOTE_LENGTH = 140;

// Date constants
export const MAX_TARGET_DATE_MONTHS = 12;
export const STREAK_GRACE_PERIOD_DAYS = 1;

// UI constants
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1280;

// Goal Categories for UI
export const GOAL_CATEGORIES = [
  { id: 'weight_loss', name: 'Weight Loss', icon: '⚖️' },
  { id: 'muscle_gain', name: 'Muscle Gain', icon: '💪' },
  { id: 'cardio', name: 'Cardio', icon: '🏃‍♂️' },
  { id: 'strength', name: 'Strength', icon: '🏋️‍♂️' },
  { id: 'flexibility', name: 'Flexibility', icon: '🧘‍♀️' },
  { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
  { id: 'habits', name: 'Habits', icon: '✅' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'other', name: 'Other', icon: '🎯' }
];

// Goal Types for UI
export const GOAL_TYPES = [
  { id: 'numeric', name: 'Numeric Goal', description: 'Track numbers (weight, time, reps)' },
  { id: 'boolean', name: 'Habit Goal', description: 'Daily yes/no tracking' }
];

// Goal type configurations
export const GOAL_TYPE_CONFIG = {
  [GoalType.STRENGTH]: {
    icon: '💪',
    label: 'Strength',
    description: 'Build muscle, lift heavier weights',
    examples: [
      'Deadlift 2x my body weight (160kg)',
      'Complete 20 pull-ups in a row',
      'Squat 120kg for 10 reps',
      'Bench press 100kg for 5 reps',
    ],
    defaultUnits: ['kg', 'lbs', 'reps'],
    color: 'bg-red-500',
  },
  [GoalType.CARDIO]: {
    icon: '🏃‍♂️',
    label: 'Cardio',
    description: 'Improve endurance, run faster/further',
    examples: [
      'Run 5K in under 30 minutes',
      'Complete a half marathon',
      'Cycle 20km without stopping',
      'Swim 1000m continuously',
    ],
    defaultUnits: ['km', 'miles', 'minutes'],
    color: 'bg-blue-500',
  },
  [GoalType.BODY]: {
    icon: '📏',
    label: 'Body',
    description: 'Track weight, measurements, body changes',
    examples: [
      'Lose 10kg by summer',
      'Reduce body fat to 15%',
      'Increase muscle mass by 5kg',
      'Reach target weight of 70kg',
    ],
    defaultUnits: ['kg', 'lbs', '%'],
    color: 'bg-green-500',
  },
  [GoalType.HABIT]: {
    icon: '🎯',
    label: 'Habit',
    description: 'Build consistency, daily routines',
    examples: [
      'Exercise 5 days per week',
      'Complete 30 days of yoga',
      'Take 10,000 steps daily',
      'Meditate for 10 minutes daily',
    ],
    defaultUnits: ['days', 'times', 'minutes'],
    color: 'bg-purple-500',
  },
} as const;

// Frequency options
export const FREQUENCY_OPTIONS = [
  {
    value: 'daily',
    label: 'Daily',
    description: 'Every day',
    daysInterval: 1,
  },
  {
    value: '3x-week',
    label: '3x per week',
    description: 'Three times per week',
    daysInterval: 2,
  },
  {
    value: '5x-week',
    label: '5x per week',
    description: 'Five times per week',
    daysInterval: 1,
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Once per week',
    daysInterval: 7,
  },
] as const;

// Unit options
export const UNIT_OPTIONS = [
  { value: 'kg', label: 'kg', category: 'weight' },
  { value: 'lbs', label: 'lbs', category: 'weight' },
  { value: 'km', label: 'km', category: 'distance' },
  { value: 'miles', label: 'miles', category: 'distance' },
  { value: 'reps', label: 'reps', category: 'count' },
  { value: 'minutes', label: 'minutes', category: 'time' },
  { value: 'hours', label: 'hours', category: 'time' },
  { value: '%', label: '%', category: 'percentage' },
  { value: 'days', label: 'days', category: 'time' },
  { value: 'times', label: 'times', category: 'count' },
] as const;

// Time range options for charts
export const TIME_RANGE_OPTIONS = [
  {
    value: '7d' as const,
    label: '7D',
    description: 'Last 7 days',
    days: 7,
  },
  {
    value: '1m' as const,
    label: '1M',
    description: 'Last 30 days',
    days: 30,
  },
  {
    value: '3m' as const,
    label: '3M',
    description: 'Last 90 days',
    days: 90,
  },
  {
    value: 'all' as const,
    label: 'All',
    description: 'All time',
    days: Infinity,
  },
] as const;

// Chart configuration
export const CHART_CONFIG = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    target: '#ef4444',
  },
  animation: {
    duration: 800,
    easing: 'easeInOut',
  },
  responsive: true,
  maintainAspectRatio: false,
} as const;

// Streak milestones
export const STREAK_MILESTONES = [
  { days: 7, emoji: '🔥', message: 'One week streak!' },
  { days: 14, emoji: '💪', message: 'Two weeks strong!' },
  { days: 30, emoji: '🎉', message: 'One month milestone!' },
  { days: 60, emoji: '🚀', message: 'Two months amazing!' },
  { days: 100, emoji: '👑', message: '100 days champion!' },
  { days: 365, emoji: '🏆', message: 'One year legend!' },
] as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'myfitness_user_preferences',
  THEME: 'myfitness_theme',
  ONBOARDING_COMPLETED: 'myfitness_onboarding_completed',
  LAST_GOAL_TYPE: 'myfitness_last_goal_type',
  CHART_TIME_RANGE: 'myfitness_chart_time_range',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  GOAL_LIMIT_REACHED: `You can have a maximum of ${MAX_GOALS_PER_USER} active goals.`,
  INVALID_DATE: 'Please select a valid target date.',
  REQUIRED_FIELD: 'This field is required.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  GOAL_CREATED: 'Goal created successfully!',
  GOAL_UPDATED: 'Goal updated successfully!',
  GOAL_COMPLETED: 'Congratulations! Goal completed!',
  GOAL_DELETED: 'Goal deleted successfully.',
  PROGRESS_ADDED: 'Progress added successfully!',
  PROGRESS_UPDATED: 'Progress updated successfully!',
  PROGRESS_DELETED: 'Progress entry deleted.',
  DATA_EXPORTED: 'Data exported successfully!',
} as const;

// Performance constants
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Feature flags (for future use)
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: false,
  ENABLE_SOCIAL_FEATURES: false,
  ENABLE_NOTIFICATIONS: false,
  ENABLE_ANALYTICS: true,
  ENABLE_OFFLINE_MODE: false,
} as const;

// SEO constants
export const SEO_CONFIG = {
  DEFAULT_TITLE: APP_NAME,
  DEFAULT_DESCRIPTION: APP_DESCRIPTION,
  DEFAULT_KEYWORDS: 'fitness, goals, tracking, progress, health, workout',
  DEFAULT_OG_IMAGE: '/og-image.png',
  TWITTER_HANDLE: '@myfitness',
} as const;

// Navigation items
export const NAVIGATION_ITEMS = [
  {
    name: 'Goals',
    href: '/dashboard',
    icon: '🎯',
    description: 'View and manage your fitness goals',
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: '📊',
    description: 'Track your progress over time',
  },
  {
    name: 'Export',
    href: '/export',
    icon: '📤',
    description: 'Export your fitness data',
  },
] as const;

// Validation constants
export const VALIDATION_RULES = {
  GOAL_DESCRIPTION: {
    MIN_LENGTH: MIN_GOAL_DESCRIPTION_LENGTH,
    MAX_LENGTH: MAX_GOAL_DESCRIPTION_LENGTH,
  },
  PROGRESS_NOTE: {
    MAX_LENGTH: MAX_PROGRESS_NOTE_LENGTH,
  },
  PROGRESS_VALUE: {
    MIN: 0,
    MAX: 10000,
  },
  TARGET_DATE: {
    MIN_DAYS_FROM_NOW: 1,
    MAX_MONTHS_FROM_NOW: MAX_TARGET_DATE_MONTHS,
  },
} as const;