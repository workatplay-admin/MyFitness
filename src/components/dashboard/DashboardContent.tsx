'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal } from '@/lib/types';

interface DashboardContentProps {
  userId?: string;
}

export function DashboardContent({ userId = 'cmcvgvx9f00012uly6dageq26' }: DashboardContentProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`/api/goals?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        const data = await response.json();
        setGoals(data.goals || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <span className="text-2xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.filter(g => g.status === 'ACTIVE').length}</div>
            <p className="text-xs text-muted-foreground">
              Keep going!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.filter(g => g.status === 'COMPLETED').length}</div>
            <p className="text-xs text-muted-foreground">
              Great job!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.reduce((acc, g) => acc + (g.progress?.length || 0), 0)}</div>
            <p className="text-xs text-muted-foreground">
              Entries logged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <span className="text-2xl">🔥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Days active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Goals</h2>
        {goals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first fitness goal to get started!
              </p>
              <button className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90">
                Create Goal
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{goal.description}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.type} • {goal.frequency}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <span>{goal.status === 'ACTIVE' ? '🟢' : '⏸️'}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      Progress entries: {goal.progress?.length || 0}
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <a
                        href={`/goals/${goal.id}`}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-50 inline-block"
                      >
                        View Details
                      </a>
                      <a
                        href={`/goals/${goal.id}`}
                        className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 inline-block"
                      >
                        Log Progress
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}