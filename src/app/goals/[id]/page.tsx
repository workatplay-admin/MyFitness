import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { GoalProgressChart } from '@/components/goals/GoalProgressChart';
import { ProgressEntryForm } from '@/components/goals/ProgressEntryForm';
import { ProgressList } from '@/components/goals/ProgressList';

interface GoalPageProps {
  params: { id: string };
}

export default async function GoalPage({ params }: GoalPageProps) {
  const goal = await prisma.goal.findUnique({
    where: { id: params.id },
    include: {
      progress: {
        orderBy: { recordedAt: 'desc' },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!goal) {
    notFound();
  }

  // Calculate progress statistics
  const progressValues = goal.progress.map(p => p.value);
  const latestValue = progressValues[0] || 0;
  const initialValue = progressValues[progressValues.length - 1] || 0;
  const totalProgress = latestValue - initialValue;
  const daysElapsed = Math.floor(
    (new Date().getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(
    0,
    Math.floor(
      (goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🏃‍♂️</span>
            <span className="text-xl font-bold">MyFitness</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/goals">All Goals</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{goal.description}</h1>
              <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <span className="mr-1">📌</span> {goal.type}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">📅</span> {goal.frequency}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🎯</span> Target: {goal.targetDate.toLocaleDateString()}
                </span>
                <span className={`flex items-center font-medium ${
                  goal.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  <span className="mr-1">●</span> {goal.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={`/goals/${goal.id}/edit`}>Edit Goal</Link>
              </Button>
              <Button variant={goal.status === 'ACTIVE' ? 'outline' : 'default'}>
                {goal.status === 'ACTIVE' ? 'Pause Goal' : 'Resume Goal'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestValue.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Latest value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalProgress > 0 ? '+' : ''}{totalProgress.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Since start</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Days Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysElapsed}</div>
              <p className="text-xs text-muted-foreground">Since creation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysRemaining}</div>
              <p className="text-xs text-muted-foreground">Until target date</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        {goal.progress.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <GoalProgressChart progress={goal.progress} />
            </CardContent>
          </Card>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Entry Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Log Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressEntryForm goalId={goal.id} />
              </CardContent>
            </Card>
          </div>

          {/* Progress History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Progress History</CardTitle>
              </CardHeader>
              <CardContent>
                {goal.progress.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No progress entries yet.</p>
                    <p className="text-sm mt-2">Log your first progress entry to start tracking!</p>
                  </div>
                ) : (
                  <ProgressList progress={goal.progress} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}