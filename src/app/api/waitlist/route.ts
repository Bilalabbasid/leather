import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const waitlistInputSchema = z.object({
  name: z.string().min(2, 'Full name is required (minimum 2 characters)'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(6, 'Valid contact telephone number is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  category: z.string().optional().default('Waitlist'),
  productTitle: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  preferredSize: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const result = waitlistInputSchema.safeParse(rawBody);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Invalid waitlist submission',
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      deliveryAddress,
      category,
      productTitle,
      productId,
      preferredSize,
      notes,
    } = result.data;

    const entry = await prisma.waitlistEntry.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        category: category || 'Waitlist',
        productTitle: productTitle || 'Atelier Bespoke Allocation',
        productId: productId || null,
        preferredSize: preferredSize || null,
        notes: notes || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'You have been registered for private atelier allocation.',
      entry: {
        id: entry.id,
        name: entry.name,
        email: entry.email,
        productTitle: entry.productTitle,
        status: entry.status,
        createdAt: entry.createdAt,
      },
    });
  } catch (err: any) {
    console.error('[Waitlist API Error]', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit waitlist registration' },
      { status: 500 }
    );
  }
}
