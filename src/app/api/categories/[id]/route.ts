import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const UpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  displayPriority: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, category });
  } catch {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Soft delete — deactivate rather than destroy
    const category = await prisma.category.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, category });
  } catch {
    return NextResponse.json({ error: 'Failed to deactivate category' }, { status: 500 });
  }
}
