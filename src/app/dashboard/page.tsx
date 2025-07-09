import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

// Placeholder components for dashboard sections
function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your fitness goals and progress
        </p>
      </div>
      <Button asChild>
        <Link href="/goals/create">
          + Create New Goal
        </Link>
      </Button>
    </div>
  );
}

function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          <span className="text-2xl">🎯</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            +1 from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <span className="text-2xl">🔥</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12 days</div>
          <p className="text-xs text-muted-foreground">
            Keep it up!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
          <span className="text-2xl">✅</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">
            +2 this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress Rate</CardTitle>
          <span className="text-2xl">📈</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87%</div>
          <p className="text-xs text-muted-foreground">
            Above average
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ActiveGoals() {
  const mockGoals = [
    {
      id: 1,
      title: "Lose 10 pounds",
      category: "Weight Loss",
      progress: 60,
      target: 10,
      current: 6,
      unit: "lbs",
      deadline: "2025-02-15",
      streak: 8
    },
    {
      id: 2,
      title: "Run 5K in under 25 minutes",
      category: "Cardio",
      progress: 75,
      target: 25,
      current: 27,
      unit: "minutes",
      deadline: "2025-01-30",
      streak: 12
    },
    {
      id: 3,
      title: "Drink 8 glasses of water daily",
      category: "Nutrition",
      progress: 90,
      target: 8,
      current: 7.2,
      unit: "glasses",
      deadline: "2025-03-01",
      streak: 15
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Active Goals</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockGoals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {goal.category}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <span>🔥</span>
                  <span>{goal.streak}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Current vs Target */}
                <div className="flex justify-between text-sm">
                  <span>Current: {goal.current} {goal.unit}</span>
                  <span>Target: {goal.target} {goal.unit}</span>
                </div>

                {/* Deadline */}
                <div className="text-sm text-muted-foreground">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/goals/${goal.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/goals/${goal.id}/progress`}>
                      Log Progress
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const mockActivity = [
    {
      id: 1,
      type: "progress",
      goal: "Lose 10 pounds",
      value: "Lost 0.5 lbs",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      type: "milestone",
      goal: "Drink 8 glasses of water daily",
      value: "15-day streak achieved!",
      timestamp: "1 day ago"
    },
    {
      id: 3,
      type: "progress",
      goal: "Run 5K in under 25 minutes",
      value: "Completed 5K in 27:30",
      timestamp: "2 days ago"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
              <div className="text-lg">
                {activity.type === 'progress' ? '📊' : '🎉'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.goal}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏃‍♂️</span>
            <span className="text-xl font-bold">MyFitness</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/goals">Goals</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/progress">Progress</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <DashboardHeader />
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}