import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { progressUpdateSchema } from '@/lib/validators';
import { z } from 'zod';

// GET /api/progress/[id] - Get a single progress entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const progress = await prisma.progress.findUnique({
      where: { id: params.id },
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

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress entry' },
      { status: 500 }
    );
  }
}

// PUT /api/progress/[id] - Update a progress entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = progressUpdateSchema.parse({
      ...body,
      id: params.id,
    });

    // Check if progress entry exists
    const existingProgress = await prisma.progress.findUnique({
      where: { id: params.id },
    });

    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progress entry not found' },
        { status: 404 }
      );
    }

    // Update progress entry
    const updateData: any = {
      value: validatedData.value,
      unit: validatedData.unit,
    };
    
    if (validatedData.note !== undefined) {
      updateData.note = validatedData.note;
    }
    
    if (validatedData.recordedAt !== undefined) {
      updateData.recordedAt = validatedData.recordedAt;
    }
    
    const updatedProgress = await prisma.progress.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(updatedProgress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating progress entry:', error);
    return NextResponse.json(
      { error: 'Failed to update progress entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/progress/[id] - Delete a progress entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if progress entry exists
    const existingProgress = await prisma.progress.findUnique({
      where: { id: params.id },
    });

    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progress entry not found' },
        { status: 404 }
      );
    }

    // Delete progress entry
    await prisma.progress.delete({
      where: { id: params.id },
    });

    // No need to update lastProgressAt as it doesn't exist in the schema

    return NextResponse.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete progress entry' },
      { status: 500 }
    );
  }
}