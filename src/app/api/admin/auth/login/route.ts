import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateAdmin, createAdminToken, COOKIE_NAME } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = loginSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const authResult = await authenticateAdmin(email, password);

    if (!authResult.success || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    const token = await createAdminToken(authResult.session);

    const response = NextResponse.json({
      success: true,
      user: {
        id: authResult.session.userId,
        email: authResult.session.email,
        name: authResult.session.name,
        role: authResult.session.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('[Admin Login Error]', err);
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 });
  }
}
