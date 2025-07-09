import { prisma } from '../src/lib/prisma';

async function addTestProgress() {
  console.log('Adding more test progress...');
  
  try {
    // Get the test user's goals
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: {
        goals: true
      }
    });

    if (!testUser) {
      console.error('Test user not found');
      return;
    }

    // Find the cardio goal that needs progress
    const cardioGoal = testUser.goals.find(g => g.type === 'CARDIO');
    
    if (cardioGoal) {
      // Add today's progress
      await prisma.progress.create({
        data: {
          goalId: cardioGoal.id,
          value: 26.2,
          unit: 'minutes',
          note: 'Almost there! Feeling good',
          recordedAt: new Date()
        }
      });
      console.log('✅ Added today\'s cardio progress');
    }

    // Find the body goal
    const bodyGoal = testUser.goals.find(g => g.type === 'BODY');
    
    if (bodyGoal) {
      // Add some body fat percentage progress
      const progressData = [
        { value: 22, daysAgo: 30, note: 'Starting point' },
        { value: 21.5, daysAgo: 25 },
        { value: 21, daysAgo: 20 },
        { value: 20.5, daysAgo: 15 },
        { value: 20, daysAgo: 10, note: 'Great progress!' },
        { value: 19.5, daysAgo: 5 },
        { value: 19, daysAgo: 0, note: 'Current measurement' }
      ];

      for (const data of progressData) {
        await prisma.progress.create({
          data: {
            goalId: bodyGoal.id,
            value: data.value,
            unit: '%',
            note: data.note || null,
            recordedAt: new Date(Date.now() - data.daysAgo * 24 * 60 * 60 * 1000)
          }
        });
      }
      console.log('✅ Added body fat percentage progress');
    }

    // Find the habit goal
    const habitGoal = testUser.goals.find(g => g.type === 'HABIT');
    
    if (habitGoal) {
      // Add daily meditation tracking (boolean-style)
      for (let i = 14; i >= 0; i--) {
        // Skip some days to show realistic tracking
        if (i === 10 || i === 6) continue;
        
        await prisma.progress.create({
          data: {
            goalId: habitGoal.id,
            value: 1, // 1 = completed, 0 = not completed
            unit: 'completed',
            note: i === 0 ? 'Morning meditation felt great!' : null,
            recordedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          }
        });
      }
      console.log('✅ Added meditation habit tracking');
    }

    console.log('🎉 Successfully added test progress data!');
  } catch (error) {
    console.error('❌ Error adding test progress:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestProgress();