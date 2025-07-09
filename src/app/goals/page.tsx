import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export default async function GoalsPage() {
  // TODO: Get userId from auth - using demo user for now
  const userId = 'cmcvgvx9f00012uly6dageq26';
  
  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      progress: {
        orderBy: { recordedAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { progress: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const activeGoals = goals.filter(g => g.status === 'ACTIVE');
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');
  const pausedGoals = goals.filter(g => g.status === 'PAUSED');

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
            <Button asChild>
              <Link href="/goals/create">Create Goal</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Goals</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your fitness goals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGoals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paused</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pausedGoals.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first fitness goal to get started!
              </p>
              <Button asChild>
                <Link href="/goals/create">Create Goal</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-green-500 mr-2">●</span> Active Goals
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-blue-500 mr-2">✓</span> Completed Goals
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {completedGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            )}

            {/* Paused Goals */}
            {pausedGoals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-gray-500 mr-2">⏸</span> Paused Goals
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pausedGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function GoalCard({ goal }: { goal: any }) {
  const latestProgress = goal.progress[0];
  const progressCount = goal._count.progress;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{goal.description}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {goal.type} • {goal.frequency}
            </p>
          </div>
          <div className={`text-sm font-medium ${
            goal.status === 'ACTIVE' ? 'text-green-600' : 
            goal.status === 'COMPLETED' ? 'text-blue-600' : 
            'text-gray-600'
          }`}>
            {goal.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Target: {new Date(goal.targetDate).toLocaleDateString()}
          </div>
          
          {latestProgress && (
            <div className="text-sm">
              Latest: {latestProgress.value} {latestProgress.unit}
              <span className="text-muted-foreground ml-2">
                ({new Date(latestProgress.recordedAt).toLocaleDateString()})
              </span>
            </div>
          )}
          
          <div className="text-sm">
            Progress entries: {progressCount}
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/goals/${goal.id}`}>View Details</Link>
            </Button>
            {goal.status === 'ACTIVE' && (
              <Button size="sm" asChild>
                <Link href={`/goals/${goal.id}`}>Log Progress</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}