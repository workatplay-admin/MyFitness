#!/usr/bin/env tsx

/**
 * Test script for authentication functionality
 * 
 * This script tests the login flow without Supabase configured.
 * For full functionality, you need to:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Add the Supabase URL and Anon Key to your .env file
 * 3. Run this script: npm run test:auth
 */

console.log('🔐 Authentication Test Script\n');

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('⚠️  Supabase is not configured!');
  console.log('\nTo enable authentication:');
  console.log('1. Create a free Supabase project at https://supabase.com');
  console.log('2. Copy your project URL and Anon Key from the project settings');
  console.log('3. Add these to your .env file:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL="your-project-url"');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"');
  console.log('\n4. Restart your development server');
  process.exit(0);
}

console.log('✅ Supabase is configured!');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);

// Test the authentication endpoints
async function testAuth() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('\n📝 Testing signup endpoint...');
  try {
    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123',
      }),
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup response:', signupData);
  } catch (error) {
    console.error('Signup test failed:', error);
  }
  
  console.log('\n🔑 Testing login endpoint...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123',
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
  } catch (error) {
    console.error('Login test failed:', error);
  }
}

// Run tests if server is running
testAuth().catch(console.error);