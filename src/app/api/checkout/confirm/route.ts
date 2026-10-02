import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!sessionId && !orderId) {
      return NextResponse.json(
        { error: 'Missing session_id or order_id' },
        { status: 400 }
      );
    }

    // 1. Locate order by orderId or stripeSessionId
    let order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(orderId ? [{ id: orderId }] : []),
          ...(sessionId ? [{ stripeSessionId: sessionId }] : []),
        ],
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order record not found' }, { status: 404 });
    }

    // 2. If already confirmed / paid / dispatched, return order details
    if (order.status !== 'PENDING') {
      return NextResponse.json({ success: true, order });
    }

    // 3. If pending, verify payment status with Stripe directly
    const rawStripeKey = process.env.STRIPE_SECRET_KEY?.trim();
    const isStripeConfigured =
      !!rawStripeKey &&
      !rawStripeKey.includes('placeholder') &&
      !rawStripeKey.includes('mock');

    if (isStripeConfigured && sessionId && !sessionId.startsWith('ACM-')) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (stripeSession.payment_status === 'paid') {
          const customerEmail =
            stripeSession.customer_details?.email ||
            stripeSession.customer_email ||
            order.customerEmail;
          const customerName = stripeSession.customer_details?.name || order.customerName;
          const shippingAddress = stripeSession.shipping_details?.address
            ? JSON.stringify(stripeSession.shipping_details.address)
            : order.shippingAddress;
          const paymentIntentId =
            typeof stripeSession.payment_intent === 'string'
              ? stripeSession.payment_intent
              : order.stripePaymentIntentId;

          // Transaction to update order and decrement stock
          const updatedOrder = await prisma.$transaction(async (tx) => {
            const current = await tx.order.findUnique({
              where: { id: order.id },
              include: { orderItems: true },
            });

            if (!current || current.status !== 'PENDING') {
              return current;
            }

            const refreshed = await tx.order.update({
              where: { id: order.id },
              data: {
                status: 'PAID',
                stripePaymentIntentId: paymentIntentId,
                customerEmail: customerEmail || 'client@acemen.co.uk',
                customerName: customerName || 'ACEMEN Patron',
                shippingAddress,
              },
              include: { orderItems: true },
            });

            // Decrement variant stock
            for (const item of refreshed.orderItems) {
              if (item.variantId) {
                await tx.variant.update({
                  where: { id: item.variantId },
                  data: {
                    stockQuantity: {
                      decrement: item.quantity,
                    },
                  },
                });
              }
            }

            return refreshed;
          });

          return NextResponse.json({ success: true, order: updatedOrder });
        }
      } catch (stripeErr: any) {
        console.warn('[Order Confirmation Stripe Check]', stripeErr.message);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('[Order Confirmation Error]', err);
    return NextResponse.json(
      { error: err.message || 'Failed to verify order status' },
      { status: 500 }
    );
  }
}
