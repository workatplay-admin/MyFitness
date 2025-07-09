import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { Goal, Progress, GoalWithProgress, StreakData, GoalType } from './types';

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
}

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d');
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Goal utilities
export function calculateProgressPercentage(currentValue: number, targetValue: number): number {
  if (targetValue <= 0) return 0;
  return Math.min(Math.round((currentValue / targetValue) * 100), 100);
}

export function isGoalUrgent(targetDate: Date | string, daysThreshold: number = 7): boolean {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= daysThreshold && diffDays > 0;
}

export function getGoalTypeIcon(type: GoalType): string {
  const icons = {
    [GoalType.STRENGTH]: '💪',
    [GoalType.CARDIO]: '🏃‍♂️',
    [GoalType.BODY]: '📏',
    [GoalType.HABIT]: '🎯',
  };
  return icons[type];
}

export function getGoalTypeLabel(type: GoalType): string {
  const labels = {
    [GoalType.STRENGTH]: 'Strength',
    [GoalType.CARDIO]: 'Cardio',
    [GoalType.BODY]: 'Body',
    [GoalType.HABIT]: 'Habit',
  };
  return labels[type];
}

export function transformGoalWithProgress(
  goal: Goal,
  progressEntries: Progress[] = []
): GoalWithProgress {
  const latestProgress = progressEntries
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
  
  // Extract target value from description (basic parsing)
  const targetMatch = goal.description.match(/(\d+(?:\.\d+)?)\s*(kg|lbs|km|miles|reps|minutes|%)/i);
  const targetValue = targetMatch ? parseFloat(targetMatch[1]) : 100;
  const targetUnit = targetMatch ? targetMatch[2] : 'units';
  
  const currentValue = latestProgress?.value || 0;
  const currentUnit = latestProgress?.unit || targetUnit;
  
  return {
    ...goal,
    currentValue: `${currentValue}${currentUnit}`,
    progressPercentage: calculateProgressPercentage(currentValue, targetValue),
    lastEntry: latestProgress ? formatRelativeTime(latestProgress.recordedAt) : 'No entries yet',
    urgent: isGoalUrgent(goal.targetDate),
  };
}

// Streak calculation utilities
export function calculateStreak(progressEntries: Progress[], frequency: string): StreakData {
  if (progressEntries.length === 0) {
    return { current: 0, longest: 0, lastUpdated: new Date() };
  }
  
  // Sort entries by date (newest first)
  const sortedEntries = progressEntries
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  
  const frequencyDays = getFrequencyDays(frequency);
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate current streak
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].recordedAt);
    entryDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (i === 0 && daysDiff <= frequencyDays + 1) { // Grace period of 1 day
      currentStreak = 1;
      tempStreak = 1;
    } else if (daysDiff <= (i + 1) * frequencyDays + 1) {
      currentStreak++;
      tempStreak++;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  tempStreak = 0;
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].recordedAt);
    const nextEntryDate = i < sortedEntries.length - 1 
      ? new Date(sortedEntries[i + 1].recordedAt) 
      : null;
    
    tempStreak++;
    
    if (nextEntryDate) {
      const daysBetween = Math.floor(
        (entryDate.getTime() - nextEntryDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysBetween > frequencyDays + 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
    }
  }
  
  return {
    current: currentStreak,
    longest: Math.max(longestStreak, currentStreak),
    lastUpdated: sortedEntries[0] ? new Date(sortedEntries[0].recordedAt) : new Date(),
  };
}

function getFrequencyDays(frequency: string): number {
  switch (frequency) {
    case 'daily':
      return 1;
    case '3x-week':
      return 2; // Every ~2 days
    case '5x-week':
      return 1; // Almost daily
    case 'weekly':
      return 7;
    default:
      return 1;
  }
}

// Chart data utilities
export function generateChartData(progressEntries: Progress[], timeRange: '7d' | '1m' | '3m' | 'all') {
  const now = new Date();
  let startDate: Date;
  
  switch (timeRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '1m':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3m':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
      break;
  }
  
  const filteredEntries = progressEntries
    .filter(entry => new Date(entry.recordedAt) >= startDate)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
  
  return {
    labels: filteredEntries.map(entry => formatDateShort(entry.recordedAt)),
    values: filteredEntries.map(entry => entry.value),
  };
}

// Form utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Local storage utilities
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message.includes('fetch') || 
     error.message.includes('network') ||
     error.message.includes('NetworkError'));
}

// URL utilities
export function createSearchParams(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// Number formatting utilities
export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
}

export function parseNumber(value: string): number | null {
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}