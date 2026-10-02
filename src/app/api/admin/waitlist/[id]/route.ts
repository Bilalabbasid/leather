import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const updateWaitlistSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  deliveryAddress: z.string().min(1).optional(),
  category: z.string().optional(),
  productTitle: z.string().nullable().optional(),
  preferredSize: z.string().nullable().optional(),
  status: z.enum(['PENDING', 'CONTACTED', 'ALLOCATED', 'FULFILLED', 'CANCELLED']).optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const entry = await prisma.waitlistEntry.findUnique({
      where: { id: params.id },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Waitlist record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve record' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const result = updateWaitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid update payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.waitlistEntry.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, entry: updated });
  } catch (err: any) {
    console.error('[Admin Waitlist PUT Error]', err);
    return NextResponse.json({ error: 'Failed to update waitlist entry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await prisma.waitlistEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Record removed successfully' });
  } catch (err: any) {
    console.error('[Admin Waitlist DELETE Error]', err);
    return NextResponse.json({ error: 'Failed to delete waitlist entry' }, { status: 500 });
  }
}
