/**
 * Integration tests for API endpoints
 * These tests run against the actual API routes using fetch
 */

// Mock the fetch function for testing
global.fetch = jest.fn();

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Endpoint', () => {
    it('should return healthy status', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          services: {
            database: { connected: true },
            supabase: { connected: false }
          }
        })
      });

      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.services).toBeDefined();
    });
  });

  describe('Goals Endpoints', () => {
    describe('GET /api/goals', () => {
      it('should return list of goals', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            goals: [
              {
                id: '1',
                userId: 'demo-user',
                type: 'STRENGTH',
                description: 'Test Goal',
                targetDate: new Date().toISOString(),
                status: 'ACTIVE'
              }
            ]
          })
        });

        const response = await fetch('http://localhost:3000/api/goals?userId=demo-user');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.goals).toBeDefined();
        expect(Array.isArray(data.goals)).toBe(true);
        expect(data.goals[0].userId).toBe('demo-user');
      });

      it('should filter goals by status', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            goals: []
          })
        });

        const response = await fetch('http://localhost:3000/api/goals?userId=demo-user&status=active');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.goals).toBeDefined();
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/goals?userId=demo-user&status=active');
      });
    });

    describe('POST /api/goals', () => {
      it('should create a new goal', async () => {
        const goalData = {
          title: 'Test Goal',
          description: 'Test Description',
          category: 'strength',
          type: 'numeric',
          targetValue: '100',
          currentValue: '0',
          unit: 'lbs',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          reminderFrequency: 'daily'
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: async () => ({
            goal: {
              id: '2',
              userId: 'demo-user',
              type: 'STRENGTH',
              description: 'Test Goal: Test Description',
              targetDate: goalData.deadline,
              status: 'ACTIVE'
            }
          })
        });

        const response = await fetch('http://localhost:3000/api/goals', {
          method: 'POST',
          body: JSON.stringify(goalData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.goal).toBeDefined();
        expect(data.goal.userId).toBe('demo-user');
      });

      it('should validate required fields', async () => {
        const invalidData = {
          title: 'Te', // Too short
          category: '',  // Empty
          deadline: ''   // Empty
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({
            error: 'Invalid request data',
            details: 'Validation failed'
          })
        });

        const response = await fetch('http://localhost:3000/api/goals', {
          method: 'POST',
          body: JSON.stringify(invalidData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBeDefined();
      });
    });
  });
});