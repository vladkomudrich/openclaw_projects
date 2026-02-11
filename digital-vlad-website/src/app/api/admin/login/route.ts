import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    // Authenticate
    const result = await authenticateAdmin(email, password);

    if (!result.success || !result.token) {
      return NextResponse.json({ error: result.error || 'Authentication failed' }, { status: 401 });
    }

    // Set cookie
    await setAuthCookie(result.token);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
