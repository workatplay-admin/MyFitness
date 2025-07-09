import { NextResponse } from 'next/server';
import { checkDatabaseConnection, getDatabaseHealth } from '@/lib/prisma';
import { checkSupabaseConnection } from '@/lib/supabase';

export async function GET() {
  try {
    // Test database connection
    const dbConnection = await checkDatabaseConnection();
    const dbHealth = await getDatabaseHealth();
    
    // Test Supabase connection (if configured)
    let supabaseConnection = { connected: false, error: 'Not configured' };
    try {
      if (process.env['NEXT_PUBLIC_SUPABASE_URL'] && process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
        const supabaseResult = await checkSupabaseConnection();
        supabaseConnection = {
          connected: supabaseResult.connected,
          error: supabaseResult.error ? String(supabaseResult.error) : 'None'
        };
      }
    } catch (error) {
      supabaseConnection = {
        connected: false,
        error: error instanceof Error ? error.message : 'Supabase connection failed'
      };
    }

    const healthStatus = {
      status: dbConnection.connected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          connected: dbConnection.connected,
          responseTime: dbHealth.status === 'healthy' ? dbHealth.responseTime : null,
          error: dbConnection.error,
        },
        supabase: {
          connected: supabaseConnection.connected,
          error: supabaseConnection.error,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env['DATABASE_URL'],
        hasSupabaseUrl: !!process.env['NEXT_PUBLIC_SUPABASE_URL'],
      },
    };

    const statusCode = dbConnection.connected ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      { status: 500 }
    );
  }
}