import { z } from 'zod';
import { GoalType, GoalStatus } from './types';

// Goal validation schemas
export const goalTypeSchema = z.nativeEnum(GoalType);
export const goalStatusSchema = z.nativeEnum(GoalStatus);

export const goalCreationSchema = z.object({
  type: goalTypeSchema,
  description: z
    .string()
    .min(10, 'Goal description must be at least 10 characters')
    .max(200, 'Goal description must be less than 200 characters')
    .trim(),
  targetDate: z
    .string()
    .refine((date) => {
      const targetDate = new Date(date);
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(today.getFullYear() + 1);
      
      return targetDate > today && targetDate <= oneYearFromNow;
    }, 'Target date must be between tomorrow and one year from now'),
  frequency: z
    .string()
    .min(1, 'Frequency is required')
    .refine((freq) => ['daily', '3x-week', '5x-week', 'weekly'].includes(freq), 'Invalid frequency'),
});

// Goal creation form schema (for the multi-step form)
export const goalCreateFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['numeric', 'boolean']),
  targetValue: z.string().optional(),
  currentValue: z.string().optional(),
  unit: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  reminderFrequency: z.enum(['daily', 'weekly', 'none'])
});

export const goalUpdateSchema = goalCreationSchema.partial().extend({
  id: z.string().cuid(),
  status: goalStatusSchema.optional(),
});

// Progress validation schemas
export const progressEntrySchema = z.object({
  goalId: z.string().cuid('Invalid goal ID'),
  value: z
    .number()
    .positive('Progress value must be positive')
    .max(10000, 'Progress value is too large'),
  unit: z
    .string()
    .min(1, 'Unit is required')
    .refine((unit) => ['kg', 'lbs', 'km', 'miles', 'reps', 'minutes', '%'].includes(unit), 'Invalid unit'),
  note: z
    .string()
    .max(140, 'Note must be less than 140 characters')
    .optional(),
  recordedAt: z.date().optional(),
});

export const progressUpdateSchema = progressEntrySchema.extend({
  id: z.string().cuid(),
});

// User validation schemas
export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email().optional(),
  createdAt: z.date(),
});

export const userUpdateSchema = z.object({
  email: z.string().email().optional(),
});

export const progressEntryFormSchema = z.object({
  goalId: z.string().min(1, 'Goal ID is required'),
  value: z
    .string()
    .min(1, 'Progress value is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Progress value must be a positive number'),
  unit: z.string().min(1, 'Unit is required'),
  note: z.string().max(140).optional(),
});

// API validation schemas
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export const timeRangeSchema = z.enum(['7d', '1m', '3m', 'all']);

export const goalQuerySchema = z.object({
  status: goalStatusSchema.optional(),
  type: goalTypeSchema.optional(),
  ...paginationSchema.shape,
});

export const progressQuerySchema = z.object({
  goalId: z.string().cuid().optional(),
  timeRange: timeRangeSchema.optional(),
  ...paginationSchema.shape,
});

// Utility validation functions
export function validateGoalDescription(description: string): { isValid: boolean; error?: string } {
  try {
    z.string().min(10).max(200).parse(description);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid description' };
    }
    return { isValid: false, error: 'Invalid description' };
  }
}

export function validateProgressValue(value: string, unit: string): { isValid: boolean; error?: string } {
  try {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      return { isValid: false, error: 'Progress value must be a positive number' };
    }
    if (numValue > 10000) {
      return { isValid: false, error: 'Progress value is too large' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid progress value' };
  }
}

export function validateTargetDate(dateString: string): { isValid: boolean; error?: string } {
  try {
    const targetDate = new Date(dateString);
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    if (isNaN(targetDate.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    if (targetDate <= today) {
      return { isValid: false, error: 'Target date must be in the future' };
    }
    
    if (targetDate > oneYearFromNow) {
      return { isValid: false, error: 'Target date must be within one year' };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid date' };
  }
}

// Type inference helpers
export type GoalCreationInput = z.infer<typeof goalCreationSchema>;
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>;
export type ProgressEntryInput = z.infer<typeof progressEntrySchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
export type GoalCreationFormInput = z.infer<typeof goalCreateFormSchema>;
export type ProgressEntryFormInput = z.infer<typeof progressEntryFormSchema>;
export type GoalQueryInput = z.infer<typeof goalQuerySchema>;
export type ProgressQueryInput = z.infer<typeof progressQuerySchema>;
export type TimeRangeInput = z.infer<typeof timeRangeSchema>;