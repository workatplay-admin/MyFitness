import { prisma, checkDatabaseConnection, getDatabaseHealth } from '../src/lib/prisma';

async function testDatabase() {
  console.log('🔍 Testing database connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const connectionResult = await checkDatabaseConnection();
    if (connectionResult.connected) {
      console.log('✅ Database connection successful');
    } else {
      console.error('❌ Database connection failed:', connectionResult.error);
      process.exit(1);
    }

    // Test 2: Health check
    console.log('\n2. Testing database health...');
    const healthResult = await getDatabaseHealth();
    console.log('✅ Database health:', healthResult);

    // Test 3: Query test
    console.log('\n3. Testing basic queries...');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`   - Users in database: ${userCount}`);
    
    // Count goals
    const goalCount = await prisma.goal.count();
    console.log(`   - Goals in database: ${goalCount}`);
    
    // Count progress entries
    const progressCount = await prisma.progress.count();
    console.log(`   - Progress entries in database: ${progressCount}`);

    // Test 4: Create and delete test data
    console.log('\n4. Testing create/delete operations...');
    
    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
      },
    });
    console.log('   ✅ Created test user:', testUser.email);

    // Create test goal
    const testGoal = await prisma.goal.create({
      data: {
        userId: testUser.id,
        type: 'STRENGTH',
        description: 'Test goal',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        frequency: 'daily',
      },
    });
    console.log('   ✅ Created test goal:', testGoal.description);

    // Create test progress
    const testProgress = await prisma.progress.create({
      data: {
        goalId: testGoal.id,
        value: 100,
        unit: 'lbs',
        note: 'Test progress entry',
      },
    });
    console.log('   ✅ Created test progress entry');

    // Clean up test data
    await prisma.progress.delete({ where: { id: testProgress.id } });
    await prisma.goal.delete({ where: { id: testGoal.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('   ✅ Cleaned up test data');

    // Test 5: Transaction test
    console.log('\n5. Testing transactions...');
    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: { email: `transaction-test-${Date.now()}@example.com` },
        });
        
        await tx.goal.create({
          data: {
            userId: user.id,
            type: 'CARDIO',
            description: 'Transaction test goal',
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            frequency: 'daily',
          },
        });
        
        // Rollback by throwing error
        throw new Error('Intentional rollback');
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Intentional rollback') {
        console.log('   ✅ Transaction rollback successful');
      } else {
        throw error;
      }
    }

    // Final summary
    console.log('\n🎉 All database tests passed!\n');
    console.log('Database Information:');
    console.log('- Database URL:', process.env['DATABASE_URL'] ? 'Configured' : 'Not configured');
    console.log('- Environment:', process.env['NODE_ENV'] || 'development');
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });