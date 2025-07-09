'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { progressEntryFormSchema } from '@/lib/validators';
import { z } from 'zod';

interface ProgressEntryFormProps {
  goalId: string;
}

export function ProgressEntryForm({ goalId }: ProgressEntryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    value: '',
    unit: 'lbs',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = progressEntryFormSchema.parse({
        goalId,
        ...formData,
      });

      // Submit to API
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
          value: parseFloat(validatedData.value),
          unit: validatedData.unit,
          note: validatedData.note || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to log progress');
      }

      // Reset form and refresh
      setFormData({ value: '', unit: formData.unit, note: '' });
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0]?.message || 'Invalid input');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="value" className="block text-sm font-medium mb-1">
          Progress Value
        </label>
        <input
          id="value"
          type="number"
          step="0.1"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter value"
          required
        />
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium mb-1">
          Unit
        </label>
        <select
          id="unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="lbs">lbs</option>
          <option value="kg">kg</option>
          <option value="miles">miles</option>
          <option value="km">km</option>
          <option value="minutes">minutes</option>
          <option value="reps">reps</option>
          <option value="%">%</option>
        </select>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium mb-1">
          Note (optional)
        </label>
        <textarea
          id="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Add a note..."
          rows={3}
          maxLength={140}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.note.length}/140 characters
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !formData.value}
      >
        {isSubmitting ? 'Logging...' : 'Log Progress'}
      </Button>
    </form>
  );
}