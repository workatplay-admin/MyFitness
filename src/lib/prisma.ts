import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function to handle Prisma client disconnection
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, error: null };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Database health check
export async function getDatabaseHealth() {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const end = Date.now();
    
    return {
      status: 'healthy',
      responseTime: end - start,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// Transaction helper
export async function withTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(callback);
}

// Soft delete helper (for future use)
export function createSoftDeleteExtension() {
  return prisma.$extends({
    model: {
      $allModels: {
        async softDelete<T>(this: T, where: any) {
          const context = prisma as any;
          return context.update({
            where,
            data: {
              deletedAt: new Date(),
            },
          });
        },
        async findManyNotDeleted<T>(this: T, args?: any) {
          const context = prisma as any;
          return context.findMany({
            ...args,
            where: {
              ...args?.where,
              deletedAt: null,
            },
          });
        },
      },
    },
  });
}

export default prisma;