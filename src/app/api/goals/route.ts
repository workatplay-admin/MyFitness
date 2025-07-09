import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { GoalStatus, GoalType } from '@/lib/types';

// Define the schema inline for now
const goalCreateFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['numeric', 'boolean']),
  targetValue: z.string().optional(),
  currentValue: z.string().optional(),
  unit: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  reminderFrequency: z.enum(['daily', 'weekly', 'none'])
});

// GET /api/goals - Get all goals for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'cmcvgvx9f00012uly6dageq26'; // Demo user ID - TODO: Get from auth
    const status = searchParams.get('status') as GoalStatus | null;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const goals = await prisma.goal.findMany({
      where,
      include: {
        progress: {
          orderBy: { recordedAt: 'desc' },
          take: 10
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = goalCreateFormSchema.parse(body);
    
    // TODO: Get userId from authentication
    const userId = 'cmcvgvx9f00012uly6dageq26'; // Demo user ID - TODO: Get from auth

    // Convert form data to database format
    // Map category to GoalType enum
    let goalType: GoalType;
    switch (validatedData.category) {
      case 'strength':
      case 'muscle_gain':
        goalType = GoalType.STRENGTH;
        break;
      case 'cardio':
        goalType = GoalType.CARDIO;
        break;
      case 'weight_loss':
      case 'nutrition':
        goalType = GoalType.BODY;
        break;
      default:
        goalType = GoalType.HABIT;
    }

    const goalData = {
      userId,
      type: goalType,
      description: validatedData.title + (validatedData.description ? ': ' + validatedData.description : ''),
      targetDate: new Date(validatedData.deadline),
      frequency: validatedData.reminderFrequency,
      status: GoalStatus.ACTIVE
    };

    const goal = await prisma.goal.create({
      data: goalData,
      include: {
        progress: true
      }
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}