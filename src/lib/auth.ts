import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_AUTH_SECRET || 'acemen_ultra_luxury_secret_session_jwt_token_2026'
);

const COOKIE_NAME = 'acemen_admin_token';

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

export async function createAdminToken(session: AdminSession): Promise<string> {
  return await new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as 'SUPER_ADMIN' | 'ADMIN',
    };
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function getAdminSessionFromRequest(req: NextRequest): Promise<AdminSession | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function authenticateAdmin(
  email: string,
  passwordPlain: string
): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Database Authentication Check
  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (user && user.isActive) {
      const matches = await bcrypt.compare(passwordPlain, user.passwordHash);
      if (matches) {
        try {
          await prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });
        } catch {
          // Non-blocking update failure
        }

        const session: AdminSession = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role as 'SUPER_ADMIN' | 'ADMIN',
        };

        return { success: true, session };
      }
    }
  } catch (dbError) {
    console.error('[DB Auth Notice, evaluating master credentials]:', dbError);
  }

  // 2. Master Executive Access Fallback (ensures director never locked out)
  if (
    normalizedEmail === 'director@acemen.uk' &&
    passwordPlain === 'AcemenLuxury2026!'
  ) {
    const session: AdminSession = {
      userId: 'master-super-admin-director',
      email: 'director@acemen.uk',
      name: 'Executive Director',
      role: 'SUPER_ADMIN',
    };
    return { success: true, session };
  }

  return { success: false, error: 'Invalid credentials' };
}

export { COOKIE_NAME };
