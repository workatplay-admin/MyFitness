#!/usr/bin/env node

/**
 * Database Testing Script
 * 
 * This script tests the database connection and operations
 * Run with: node scripts/test-db.js
 */

const { runDatabaseTests } = require('../src/lib/db-test.ts');

async function main() {
  console.log('🚀 MyFitness Database Integration Tests\n');
  console.log('=' .repeat(50));
  
  try {
    const results = await runDatabaseTests();
    
    // Exit with appropriate code
    const allPassed = results.connection.success && results.operations.success && results.seeding.success;
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('\n💥 Fatal error running database tests:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

main();