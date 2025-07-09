import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    await prisma.progress.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleared existing data');

    // Create test users
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
      },
    });
    console.log('✅ Created test user:', testUser.email);

    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
      },
    });
    console.log('✅ Created demo user:', demoUser.email);

    // Create goals for test user
    const goals = await Promise.all([
      // Strength goal
      prisma.goal.create({
        data: {
          userId: testUser.id,
          type: 'STRENGTH',
          description: 'Bench press 200 lbs for 5 reps',
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          frequency: '3x-week',
          status: 'ACTIVE',
        },
      }),
      // Cardio goal
      prisma.goal.create({
        data: {
          userId: testUser.id,
          type: 'CARDIO',
          description: 'Run 5K in under 25 minutes',
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          frequency: '5x-week',
          status: 'ACTIVE',
        },
      }),
      // Body goal
      prisma.goal.create({
        data: {
          userId: testUser.id,
          type: 'BODY',
          description: 'Reduce body fat to 15%',
          targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
          frequency: 'daily',
          status: 'ACTIVE',
        },
      }),
      // Habit goal
      prisma.goal.create({
        data: {
          userId: testUser.id,
          type: 'HABIT',
          description: 'Meditate for 10 minutes daily',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          frequency: 'daily',
          status: 'ACTIVE',
        },
      }),
    ]);
    console.log(`✅ Created ${goals.length} goals for test user`);

    // Create progress entries for the strength goal
    const strengthGoal = goals[0];
    const progressEntries = [];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    for (let i = 0; i < 10; i++) {
      const recordedAt = new Date(startDate.getTime() + i * 3 * 24 * 60 * 60 * 1000); // Every 3 days
      const baseWeight = 150;
      const increment = i * 5;
      
      progressEntries.push(
        prisma.progress.create({
          data: {
            goalId: strengthGoal.id,
            value: baseWeight + increment,
            unit: 'lbs',
            note: i === 5 ? 'Felt strong today!' : null,
            recordedAt,
          },
        })
      );
    }

    await Promise.all(progressEntries);
    console.log(`✅ Created ${progressEntries.length} progress entries`);

    // Create some progress for cardio goal
    const cardioGoal = goals[1];
    await prisma.progress.createMany({
      data: [
        {
          goalId: cardioGoal.id,
          value: 32,
          unit: 'minutes',
          note: 'First attempt',
          recordedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          goalId: cardioGoal.id,
          value: 29.5,
          unit: 'minutes',
          note: 'Getting better!',
          recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          goalId: cardioGoal.id,
          value: 27,
          unit: 'minutes',
          recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
    });
    console.log('✅ Created cardio progress entries');

    // Create demo user goals
    await prisma.goal.createMany({
      data: [
        {
          userId: demoUser.id,
          type: 'STRENGTH',
          description: 'Complete 100 push-ups in a row',
          targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          frequency: 'daily',
          status: 'ACTIVE',
        },
        {
          userId: demoUser.id,
          type: 'CARDIO',
          description: 'Swim 1 mile non-stop',
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          frequency: '3x-week',
          status: 'ACTIVE',
        },
      ],
    });
    console.log('✅ Created demo user goals');

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });