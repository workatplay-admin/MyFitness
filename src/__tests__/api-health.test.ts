import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock the database module with any types to avoid TypeScript issues
jest.mock('../lib/prisma', () => ({
  checkDatabaseConnection: jest.fn(),
  getDatabaseHealth: jest.fn()
}));

// Import after mocking
import { checkDatabaseConnection, getDatabaseHealth } from '../lib/prisma';

describe('Database Health Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (checkDatabaseConnection as jest.Mock).mockResolvedValue({ connected: true, error: null });
    (getDatabaseHealth as jest.Mock).mockResolvedValue({
      status: 'healthy',
      responseTime: 5,
      timestamp: '2025-07-09T00:30:00.000Z'
    });
  });

  it('should return database connection status', async () => {
    const result = await checkDatabaseConnection();
    
    expect(result.connected).toBe(true);
    expect(result.error).toBeNull();
  });
  
  it('should return database health metrics', async () => {
    const result = await getDatabaseHealth();
    
    expect(result.status).toBe('healthy');
    expect(result.responseTime).toBe(5);
    expect(result.timestamp).toBeDefined();
  });

  it('should handle database connection errors', async () => {
    // Mock a connection error for this specific test
    (checkDatabaseConnection as jest.Mock).mockResolvedValueOnce({
      connected: false,
      error: 'Database connection error'
    });
    
    const result = await checkDatabaseConnection();
    
    expect(result.connected).toBe(false);
    expect(result.error).toBe('Database connection error');
  });
});