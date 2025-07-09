import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { progressEntrySchema, progressQuerySchema } from '@/lib/validators';
import { z } from 'zod';

// GET /api/progress - Get progress entries with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      goalId: searchParams.get('goalId') || undefined,
      timeRange: searchParams.get('timeRange') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    };

    // Validate query parameters
    const validatedQuery = progressQuerySchema.parse(queryParams);
    
    // Build where clause
    const where: any = {};
    
    if (validatedQuery.goalId) {
      where.goalId = validatedQuery.goalId;
    }
    
    // Apply time range filter
    if (validatedQuery.timeRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (validatedQuery.timeRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1m':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '3m':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      where.recordedAt = {
        gte: startDate,
      };
    }
    
    // Calculate pagination
    const skip = (validatedQuery.page - 1) * validatedQuery.limit;
    
    // Get total count for pagination
    const totalCount = await prisma.progress.count({ where });
    
    // Get progress entries
    const progressEntries = await prisma.progress.findMany({
      where,
      include: {
        goal: {
          select: {
            id: true,
            description: true,
            type: true,
          },
        },
      },
      orderBy: {
        recordedAt: 'desc',
      },
      skip,
      take: validatedQuery.limit,
    });
    
    return NextResponse.json({
      data: progressEntries,
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / validatedQuery.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error fetching progress entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress entries' },
      { status: 500 }
    );
  }
}

// POST /api/progress - Create a new progress entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = progressEntrySchema.parse({
      ...body,
      recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
    });
    
    // Check if goal exists
    const goal = await prisma.goal.findUnique({
      where: { id: validatedData.goalId },
    });
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    // Create progress entry
    const progress = await prisma.progress.create({
      data: {
        goalId: validatedData.goalId,
        value: validatedData.value,
        unit: validatedData.unit,
        note: validatedData.note,
        recordedAt: validatedData.recordedAt || new Date(),
      },
      include: {
        goal: {
          select: {
            id: true,
            description: true,
            type: true,
          },
        },
      },
    });
    
    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating progress entry:', error);
    return NextResponse.json(
      { error: 'Failed to create progress entry' },
      { status: 500 }
    );
  }
}