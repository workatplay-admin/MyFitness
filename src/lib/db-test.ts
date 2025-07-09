import { prisma, checkDatabaseConnection, getDatabaseHealth } from './prisma';
import { GoalType, GoalStatus } from './types';

// Database connection test
export async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  const connectionResult = await checkDatabaseConnection();
  
  if (connectionResult.connected) {
    console.log('✅ Database connection successful');
    
    // Get health metrics
    const health = await getDatabaseHealth();
    console.log(`📊 Database health: ${health.status}`);
    console.log(`⏱️  Response time: ${health.responseTime}ms`);
    
    return { success: true, health };
  } else {
    console.error('❌ Database connection failed:', connectionResult.error);
    return { success: false, error: connectionResult.error };
  }
}

// Test database operations
export async function testDatabaseOperations() {
  console.log('🧪 Testing database operations...');
  
  try {
    // Test 1: Create a test user
    console.log('1️⃣ Testing user creation...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
      },
    });
    console.log('✅ User created:', testUser.id);

    // Test 2: Create a test goal
    console.log('2️⃣ Testing goal creation...');
    const testGoal = await prisma.goal.create({
      data: {
        userId: testUser.id,
        type: GoalType.STRENGTH,
        description: 'Test goal: Bench press 100kg',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        frequency: 'daily',
        status: GoalStatus.ACTIVE,
      },
    });
    console.log('✅ Goal created:', testGoal.id);

    // Test 3: Create progress entries
    console.log('3️⃣ Testing progress creation...');
    const progressEntries = await Promise.all([
      prisma.progress.create({
        data: {
          goalId: testGoal.id,
          value: 80,
          unit: 'kg',
          note: 'First attempt',
        },
      }),
      prisma.progress.create({
        data: {
          goalId: testGoal.id,
          value: 85,
          unit: 'kg',
          note: 'Getting stronger!',
        },
      }),
    ]);
    console.log('✅ Progress entries created:', progressEntries.length);

    // Test 4: Query with relations
    console.log('4️⃣ Testing complex queries...');
    const userWithGoals = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        goals: {
          include: {
            progress: {
              orderBy: { recordedAt: 'desc' },
              take: 5,
            },
          },
        },
      },
    });
    console.log('✅ Complex query successful. Goals found:', userWithGoals?.goals.length);

    // Test 5: Cleanup test data
    console.log('5️⃣ Cleaning up test data...');
    await prisma.progress.deleteMany({
      where: { goalId: testGoal.id },
    });
    await prisma.goal.delete({
      where: { id: testGoal.id },
    });
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log('✅ Test data cleaned up');

    return { success: true, message: 'All database operations completed successfully' };
  } catch (error) {
    console.error('❌ Database operation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Seed development data
export async function seedDevelopmentData() {
  console.log('🌱 Seeding development data...');
  
  try {
    // Create demo user
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@myfitness.com' },
      update: {},
      create: {
        id: 'demo-user',
        email: 'demo@myfitness.com',
      },
    });
    console.log('✅ Demo user created/updated:', demoUser.id);

    // Create sample goals
    const sampleGoals = [
      {
        type: GoalType.BODY,
        description: 'Lose 10 pounds for summer',
        targetDate: new Date('2025-06-01'),
        frequency: 'daily',
        status: GoalStatus.ACTIVE,
      },
      {
        type: GoalType.CARDIO,
        description: 'Run 5K in under 25 minutes',
        targetDate: new Date('2025-03-15'),
        frequency: 'daily',
        status: GoalStatus.ACTIVE,
      },
      {
        type: GoalType.HABIT,
        description: 'Drink 8 glasses of water daily',
        targetDate: new Date('2025-12-31'),
        frequency: 'daily',
        status: GoalStatus.ACTIVE,
      },
      {
        type: GoalType.STRENGTH,
        description: 'Bench press 100kg',
        targetDate: new Date('2025-04-01'),
        frequency: 'weekly',
        status: GoalStatus.COMPLETED,
      },
    ];

    const createdGoals = [];
    for (const goalData of sampleGoals) {
      const goal = await prisma.goal.upsert({
        where: {
          userId_description: {
            userId: demoUser.id,
            description: goalData.description,
          },
        },
        update: goalData,
        create: {
          ...goalData,
          userId: demoUser.id,
        },
      });
      createdGoals.push(goal);
    }
    console.log('✅ Sample goals created:', createdGoals.length);

    // Add progress entries for active goals
    const activeGoals = createdGoals.filter(g => g.status === GoalStatus.ACTIVE);
    for (const goal of activeGoals) {
      // Add some historical progress
      const progressData = [];
      const daysBack = Math.floor(Math.random() * 14) + 7; // 7-21 days of data
      
      for (let i = daysBack; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        let value: number;
        let unit: string;
        
        switch (goal.type) {
          case GoalType.BODY:
            value = 180 - (daysBack - i) * 0.3; // Gradual weight loss
            unit = 'lbs';
            break;
          case GoalType.CARDIO:
            value = 30 - (daysBack - i) * 0.2; // Improving time
            unit = 'minutes';
            break;
          case GoalType.HABIT:
            value = Math.random() > 0.2 ? 8 : Math.floor(Math.random() * 6) + 4; // Mostly successful
            unit = 'glasses';
            break;
          default:
            value = 70 + (daysBack - i) * 2; // Progressive strength gain
            unit = 'kg';
        }
        
        progressData.push({
          goalId: goal.id,
          value,
          unit,
          recordedAt: date,
          note: i === 0 ? 'Latest entry' : undefined,
        });
      }
      
      // SQLite doesn't support skipDuplicates, so we'll create them individually
      for (const progress of progressData) {
        try {
          await prisma.progress.create({
            data: progress,
          });
        } catch (error) {
          // Skip duplicates silently
          continue;
        }
      }
    }
    console.log('✅ Progress entries created for active goals');

    return { success: true, message: 'Development data seeded successfully' };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Complete database test suite
export async function runDatabaseTests() {
  console.log('🚀 Starting comprehensive database tests...\n');
  
  const results = {
    connection: await testDatabaseConnection(),
    operations: await testDatabaseOperations(),
    seeding: await seedDevelopmentData(),
  };
  
  console.log('\n📋 Test Results Summary:');
  console.log('Connection:', results.connection.success ? '✅ PASS' : '❌ FAIL');
  console.log('Operations:', results.operations.success ? '✅ PASS' : '❌ FAIL');
  console.log('Seeding:', results.seeding.success ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = results.connection.success && results.operations.success && results.seeding.success;
  console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  return results;
}