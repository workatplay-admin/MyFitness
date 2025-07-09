import { prisma } from '../src/lib/prisma';

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      _count: {
        select: {
          goals: true
        }
      }
    }
  });
  
  console.log('Users in database:');
  users.forEach(user => {
    console.log(`- ID: ${user.id}, Email: ${user.email}, Goals: ${user._count.goals}`);
  });
  
  await prisma.$disconnect();
}

getUsers().catch(console.error);