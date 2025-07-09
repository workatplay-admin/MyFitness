'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Progress } from '@/lib/types';

interface ProgressListProps {
  progress: Progress[];
}

export function ProgressList({ progress }: ProgressListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (progressId: string) => {
    if (!confirm('Are you sure you want to delete this progress entry?')) {
      return;
    }

    setDeletingId(progressId);
    try {
      const response = await fetch(`/api/progress/${progressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete progress entry');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting progress:', error);
      alert('Failed to delete progress entry');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const recordedDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - recordedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return recordedDate.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-4">
      {progress.map((entry) => (
        <div
          key={entry.id}
          className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold">
                {entry.value} {entry.unit}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(entry.recordedAt)}
              </div>
            </div>
            {entry.note && (
              <p className="mt-2 text-sm text-gray-600">{entry.note}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(entry.id)}
            disabled={deletingId === entry.id}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {deletingId === entry.id ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      ))}
    </div>
  );
}