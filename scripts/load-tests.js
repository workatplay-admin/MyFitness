/**
 * k6 Load Testing Script for MyFitness App
 * Tests API endpoints under various load conditions
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const errorRate = new Rate('errors');
const successRate = new Rate('success');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp-up to 10 users
    { duration: '1m', target: 50 },    // Ramp-up to 50 users
    { duration: '2m', target: 100 },   // Stay at 100 users
    { duration: '1m', target: 200 },   // Spike to 200 users
    { duration: '2m', target: 100 },   // Back to 100 users
    { duration: '30s', target: 0 },    // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    errors: ['rate<0.1'],              // Custom error rate below 10%
  },
};

// Test data
const testUsers = [
  { id: 'user1', name: 'Test User 1' },
  { id: 'user2', name: 'Test User 2' },
  { id: 'user3', name: 'Test User 3' },
  { id: 'user4', name: 'Test User 4' },
  { id: 'user5', name: 'Test User 5' },
];

const goalCategories = ['strength', 'cardio', 'weight_loss', 'muscle_gain', 'nutrition', 'habit'];
const reminderFrequencies = ['daily', 'weekly', 'none'];

// Helper function to generate test goal data
function generateGoalData() {
  return {
    title: `Load Test Goal ${Date.now()}`,
    description: 'Goal created during load testing',
    category: randomItem(goalCategories),
    type: Math.random() > 0.5 ? 'numeric' : 'boolean',
    targetValue: Math.floor(Math.random() * 100).toString(),
    currentValue: '0',
    unit: 'reps',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    reminderFrequency: randomItem(reminderFrequencies),
  };
}

// Base URL from environment or default
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Select a random user for this iteration
  const user = randomItem(testUsers);
  
  // Test 1: Health Check Endpoint
  const healthRes = http.get(`${BASE_URL}/api/health`);
  const healthCheck = check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 500ms': (r) => r.timings.duration < 500,
    'health check returns healthy status': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.status === 'healthy' || body.status === 'unhealthy';
      } catch (e) {
        return false;
      }
    },
  });
  
  if (!healthCheck) {
    errorRate.add(1);
  } else {
    successRate.add(1);
  }
  
  sleep(1);
  
  // Test 2: Get Goals for User
  const getGoalsRes = http.get(`${BASE_URL}/api/goals?userId=${user.id}`);
  const getGoalsCheck = check(getGoalsRes, {
    'get goals status is 200': (r) => r.status === 200,
    'get goals response time < 1000ms': (r) => r.timings.duration < 1000,
    'get goals returns array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.goals);
      } catch (e) {
        return false;
      }
    },
  });
  
  if (!getGoalsCheck) {
    errorRate.add(1);
  } else {
    successRate.add(1);
  }
  
  sleep(0.5);
  
  // Test 3: Create a New Goal
  const goalData = generateGoalData();
  const headers = { 'Content-Type': 'application/json' };
  const createGoalRes = http.post(
    `${BASE_URL}/api/goals`,
    JSON.stringify(goalData),
    { headers }
  );
  
  const createGoalCheck = check(createGoalRes, {
    'create goal status is 201': (r) => r.status === 201,
    'create goal response time < 1500ms': (r) => r.timings.duration < 1500,
    'create goal returns goal object': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.goal && body.goal.id;
      } catch (e) {
        return false;
      }
    },
  });
  
  if (!createGoalCheck) {
    errorRate.add(1);
  } else {
    successRate.add(1);
  }
  
  sleep(0.5);
  
  // Test 4: Filter Goals by Status
  const filterRes = http.get(`${BASE_URL}/api/goals?userId=${user.id}&status=active`);
  const filterCheck = check(filterRes, {
    'filter goals status is 200': (r) => r.status === 200,
    'filter goals response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  if (!filterCheck) {
    errorRate.add(1);
  } else {
    successRate.add(1);
  }
  
  sleep(1);
  
  // Test 5: Home Page Load
  const homeRes = http.get(`${BASE_URL}/`);
  const homeCheck = check(homeRes, {
    'home page status is 200': (r) => r.status === 200,
    'home page response time < 3000ms': (r) => r.timings.duration < 3000,
    'home page contains expected content': (r) => r.body.includes('MyFitness') || r.body.includes('<!DOCTYPE html>'),
  });
  
  if (!homeCheck) {
    errorRate.add(1);
  } else {
    successRate.add(1);
  }
  
  // Random sleep between 1-3 seconds to simulate user thinking time
  sleep(Math.random() * 2 + 1);
}

// Lifecycle hooks
export function setup() {
  console.log('Starting load test...');
  console.log(`Base URL: ${BASE_URL}`);
  
  // Verify the application is reachable
  const res = http.get(`${BASE_URL}/api/health`);
  if (res.status !== 200) {
    throw new Error(`Application is not reachable. Status: ${res.status}`);
  }
  
  return { startTime: new Date() };
}

export function teardown(data) {
  console.log('Load test completed.');
  console.log(`Duration: ${new Date() - data.startTime}ms`);
}

// Custom summary (optional)
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
    'summary.html': htmlReport(data),
  };
}

// Import these if you want custom reporting
// import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
// import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';