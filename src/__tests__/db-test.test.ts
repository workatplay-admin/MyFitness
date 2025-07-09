import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client and functions
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $queryRaw: jest.fn().mockResolvedValue([{ '1': 1 }]),
    $disconnect: jest.fn(),
    user: {
      create: jest.fn().mockResolvedValue({ id: 'test-user-id', email: 'test@example.com' }),
      delete: jest.fn().mockResolvedValue({ id: 'test-user-id' }),
      upsert: jest.fn().mockResolvedValue({ id: 'demo-user', email: 'demo@myfitness.com' }),
      findUnique: jest.fn().mockResolvedValue({ id: 'test-user-id', goals: [] })
    },
    goal: {
      create: jest.fn().mockResolvedValue({
        id: 'test-goal-id',
        userId: 'test-user-id',
        type: 'STRENGTH',
        description: 'Test goal'
      }),
      delete: jest.fn().mockResolvedValue({ id: 'test-goal-id' }),
      findUnique: jest.fn().mockResolvedValue({
        id: 'test-goal-id',
        goals: [{ id: 'test-goal-id' }]
      }),
      upsert: jest.fn().mockResolvedValue({ id: 'test-goal-id' })
    },
    progress: {
      create: jest.fn().mockResolvedValue({ id: 'test-progress-id' }),
      createMany: jest.fn().mockResolvedValue({ count: 2 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 2 })
    },
    $transaction: jest.fn().mockImplementation(fn => fn())
  }))
}));

// Mock Prisma module
jest.mock('../lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn().mockResolvedValue([{ '1': 1 }]),
    user: {
      create: jest.fn().mockResolvedValue({ id: 'test-user-id', email: 'test@example.com' }),
      delete: jest.fn().mockResolvedValue({ id: 'test-user-id' }),
      upsert: jest.fn().mockResolvedValue({ id: 'demo-user', email: 'demo@myfitness.com' }),
      findUnique: jest.fn().mockResolvedValue({ id: 'test-user-id', goals: [] })
    },
    goal: {
      create: jest.fn().mockResolvedValue({ id: 'test-goal-id', userId: 'test-user-id' }),
      delete: jest.fn().mockResolvedValue({ id: 'test-goal-id' }),
      upsert: jest.fn().mockResolvedValue({ id: 'test-goal-id' }),
      findUnique: jest.fn().mockResolvedValue({
        id: 'test-goal-id',
        goals: [{ id: 'test-goal-id' }]
      })
    },
    progress: {
      create: jest.fn().mockResolvedValue({ id: 'test-progress-id' }),
      createMany: jest.fn().mockResolvedValue({ count: 2 }),
      deleteMany: jest.fn().mockResolvedValue({ count: 2 })
    }
  },
  checkDatabaseConnection: jest.fn().mockResolvedValue({ connected: true, error: null }),
  getDatabaseHealth: jest.fn().mockResolvedValue({
    status: 'healthy',
    responseTime: 5,
    timestamp: new Date().toISOString()
  })
}));

// Import the functions we want to test
import { testDatabaseConnection, testDatabaseOperations, seedDevelopmentData } from '../lib/db-test';
import { prisma, checkDatabaseConnection, getDatabaseHealth } from '../lib/prisma';

// Type the mocked functions
const mockCheckDb = checkDatabaseConnection as jest.MockedFunction<typeof checkDatabaseConnection>;
const mockGetHealth = getDatabaseHealth as jest.MockedFunction<typeof getDatabaseHealth>;

describe('Database Test Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('testDatabaseConnection', () => {
    it('should return healthy status when database connection is successful', async () => {
      const result = await testDatabaseConnection();
      
      expect(result.success).toBe(true);
      expect(result.health).toBeDefined();
      if (result.success && result.health) {
        expect(result.health.status).toBe('healthy');
        expect(typeof result.health.responseTime).toBe('number');
      }
    });

    it('should handle database connection errors gracefully', async () => {
      // Mock a database error
      mockCheckDb.mockResolvedValueOnce({ connected: false, error: 'Connection failed' });
      
      const result = await testDatabaseConnection();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Connection failed');
    });
  });

  describe('testDatabaseOperations', () => {
    it('should successfully test all database operations', async () => {
      const result = await testDatabaseOperations();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('All database operations completed successfully');
    });

    it('should handle database operation errors gracefully', async () => {
      // Mock prisma user create to fail
      const mockPrisma = prisma as any;
      mockPrisma.user.create.mockRejectedValueOnce(new Error('Database error'));
      
      const result = await testDatabaseOperations();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('seedDevelopmentData', () => {
    it('should successfully seed development data', async () => {
      const result = await seedDevelopmentData();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Development data seeded successfully');
    });

    it('should handle seeding errors gracefully', async () => {
      // Mock prisma user upsert to fail
      const mockPrisma = prisma as any;
      mockPrisma.user.upsert.mockRejectedValueOnce(new Error('Seeding error'));
      
      const result = await seedDevelopmentData();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Seeding error');
    });
  });
});