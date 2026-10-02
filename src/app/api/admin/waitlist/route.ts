import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { deliveryAddress: { contains: query, mode: 'insensitive' } },
        { productTitle: { contains: query, mode: 'insensitive' } },
      ];
    }

    const entries = await prisma.waitlistEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: entries.length,
      entries,
    });
  } catch (err: any) {
    console.error('[Admin Waitlist GET Error]', err);
    return NextResponse.json({ error: 'Failed to retrieve waitlist entries' }, { status: 500 });
  }
}

const adminCreateWaitlistSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  deliveryAddress: z.string().min(3),
  category: z.string().optional().default('Waitlist'),
  productTitle: z.string().optional().nullable(),
  preferredSize: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'CONTACTED', 'ALLOCATED', 'FULFILLED', 'CANCELLED']).optional().default('PENDING'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const result = adminCreateWaitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const entry = await prisma.waitlistEntry.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (err: any) {
    console.error('[Admin Waitlist POST Error]', err);
    return NextResponse.json({ error: 'Failed to create waitlist entry' }, { status: 500 });
  }
}
