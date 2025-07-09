import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { goalUpdateSchema } from '@/lib/validators';
import { z } from 'zod';

// GET /api/goals/[id] - Get a single goal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: params.id },
      include: {
        progress: {
          orderBy: { recordedAt: 'desc' },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ goal });
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

// PUT /api/goals/[id] - Update a goal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = goalUpdateSchema.parse({
      ...body,
      id: params.id,
    });

    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id: params.id },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Build update data object with only defined values
    const updateData: any = {};
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.targetDate !== undefined) updateData.targetDate = new Date(validatedData.targetDate);
    if (validatedData.frequency !== undefined) updateData.frequency = validatedData.frequency;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;

    // Update goal
    const updatedGoal = await prisma.goal.update({
      where: { id: params.id },
      data: updateData,
      include: {
        progress: true,
      },
    });

    return NextResponse.json({ goal: updatedGoal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id: params.id },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Delete goal (cascades to progress entries)
    await prisma.goal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}