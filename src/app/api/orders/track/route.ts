import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber')?.trim().toUpperCase();
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order reference number is required (e.g. ACM-2026-XXXXXX)' },
        { status: 400 }
      );
    }

    const where: any = {
      orderNumber,
    };

    if (email) {
      where.customerEmail = {
        equals: email,
        mode: 'insensitive',
      };
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No atelier order found matching the provided reference number.' },
        { status: 404 }
      );
    }

    // Parse sanitized shipping destination
    let shippingCity = null;
    let shippingCountry = null;
    if (order.shippingAddress) {
      try {
        const parsed = JSON.parse(order.shippingAddress);
        shippingCity = parsed.city || null;
        shippingCountry = parsed.country || null;
      } catch {
        // Non-JSON string
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        currency: order.currency,
        totalInPence: order.totalInPence,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shippingCity,
        shippingCountry,
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          title: item.title,
          sku: item.sku,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPriceInPence: item.unitPriceInPence,
          lineTotalInPence: item.lineTotalInPence,
          imageUrl: item.product?.images?.[0]?.url || null,
        })),
      },
    });
  } catch (err: any) {
    console.error('[Order Tracking Error]', err);
    return NextResponse.json(
      { error: 'Failed to look up order tracking record' },
      { status: 500 }
    );
  }
}
