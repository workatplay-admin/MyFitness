import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/supabase';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;
    
    // Attempt to sign up with Supabase
    const { data, error } = await signUp(email, password);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Signup failed' },
        { status: 400 }
      );
    }

    // Create user in our database
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    } catch (dbError) {
      console.error('Database user creation error:', dbError);
      // Continue even if database creation fails - user can still use Supabase auth
    }

    // Return success response
    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      message: 'Account created successfully. Please check your email to verify your account.',
    });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}