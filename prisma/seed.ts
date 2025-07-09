import { PrismaClient } from '@prisma/client';
import { GoalType, GoalStatus } from '../src/lib/types';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { id: 'demo-user' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'demo@myfitness.com',
    },
  });

  console.log('Created demo user:', demoUser);

  // Create sample goals
  const goals = [
    {
      id: 'goal-1',
      userId: 'demo-user',
      type: GoalType.BODY,
      description: 'Lose 10 pounds',
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      frequency: 'daily',
      status: GoalStatus.ACTIVE,
    },
    {
      id: 'goal-2',
      userId: 'demo-user',
      type: GoalType.CARDIO,
      description: 'Run 5K in under 25 minutes',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      frequency: '3x-week',
      status: GoalStatus.ACTIVE,
    },
    {
      id: 'goal-3',
      userId: 'demo-user',
      type: GoalType.HABIT,
      description: 'Drink 8 glasses of water daily',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      frequency: 'daily',
      status: GoalStatus.ACTIVE,
    },
  ];

  const createdGoals = [];
  for (const goal of goals) {
    const createdGoal = await prisma.goal.upsert({
      where: {
        userId_description: {
          userId: goal.userId,
          description: goal.description
        }
      },
      update: {},
      create: goal,
    });
    createdGoals.push(createdGoal);
  }

  console.log('Created sample goals');

  // Create sample progress entries using actual goal IDs
  const progressEntries = [
    {
      goalId: createdGoals[0].id, // 'Lose 10 pounds'
      value: 2.5,
      unit: 'lbs',
      note: 'Good progress this week',
      recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      goalId: createdGoals[0].id, // 'Lose 10 pounds'
      value: 4.0,
      unit: 'lbs',
      note: 'Staying consistent',
      recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      goalId: createdGoals[1].id, // 'Run 5K in under 25 minutes'
      value: 27.5,
      unit: 'minutes',
      note: 'Getting closer to target',
      recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      goalId: createdGoals[1].id, // 'Run 5K in under 25 minutes'
      value: 26.8,
      unit: 'minutes',
      note: 'Improved by 30 seconds',
      recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      goalId: createdGoals[2].id, // 'Drink 8 glasses of water daily'
      value: 8,
      unit: 'glasses',
      note: 'Met daily goal',
      recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  for (const entry of progressEntries) {
    await prisma.progress.create({
      data: entry,
    });
  }

  console.log('Created sample progress entries');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });