import { NextRequest, NextResponse } from 'next/server';
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
    if (status) {
      where.status = status;
    }
    if (query) {
      where.OR = [
        { orderNumber: { contains: query } },
        { customerEmail: { contains: query } },
        { customerName: { contains: query } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (err: any) {
    console.error('[Admin Orders GET Error]', err);
    return NextResponse.json({ error: 'Failed to retrieve orders' }, { status: 500 });
  }
}
