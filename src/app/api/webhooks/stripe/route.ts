import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Stripe Webhook] Webhook secret is not configured.');
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured in server environment.' },
      { status: 500 }
    );
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook Error] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Signature verification failed: ${err.message}` }, { status: 400 });
  }

  // 1. Idempotency Check: record event ID before processing
  const existingEvent = await prisma.stripeWebhookEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent && existingEvent.processingStatus === 'PROCESSED') {
    // Already processed successfully; return 200 to prevent duplicate work
    return NextResponse.json({ received: true, note: 'Event already processed' });
  }

  // Mark event as pending if not already recorded
  if (!existingEvent) {
    await prisma.stripeWebhookEvent.create({
      data: {
        stripeEventId: event.id,
        eventType: event.type,
        processingStatus: 'PENDING',
      },
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const sessionId = session.id;

        const customerEmail =
          session.customer_details?.email || session.customer_email || 'client@acemen.uk';
        const customerName = session.customer_details?.name || 'ACEMEN Patron';
        const shippingAddress = session.shipping_details?.address
          ? JSON.stringify(session.shipping_details.address)
          : null;
        const paymentIntentId =
          typeof session.payment_intent === 'string' ? session.payment_intent : null;

        // Atomically update Order status and decrement inventory in a Prisma transaction
        await prisma.$transaction(async (tx) => {
          let order = null;

          if (orderId) {
            order = await tx.order.findUnique({
              where: { id: orderId },
              include: { orderItems: true },
            });
          } else if (sessionId) {
            order = await tx.order.findUnique({
              where: { stripeSessionId: sessionId },
              include: { orderItems: true },
            });
          }

          if (order) {
            // Update order to PAID
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: 'PAID',
                stripePaymentIntentId: paymentIntentId,
                customerEmail,
                customerName,
                shippingAddress,
              },
            });

            // Atomically decrement variant stock for each ordered line item
            for (const item of order.orderItems) {
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
          }

          // Mark event as processed
          await tx.stripeWebhookEvent.update({
            where: { stripeEventId: event.id },
            data: {
              processingStatus: 'PROCESSED',
              processedAt: new Date(),
            },
          });
        });

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await prisma.order.updateMany({
            where: { id: orderId, status: 'PENDING' },
            data: { status: 'CANCELLED' },
          });
        }

        await prisma.stripeWebhookEvent.update({
          where: { stripeEventId: event.id },
          data: { processingStatus: 'PROCESSED', processedAt: new Date() },
        });
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === 'string' ? charge.payment_intent : null;

        if (paymentIntentId) {
          await prisma.order.updateMany({
            where: { stripePaymentIntentId: paymentIntentId },
            data: { status: 'REFUNDED' },
          });
        }

        await prisma.stripeWebhookEvent.update({
          where: { stripeEventId: event.id },
          data: { processingStatus: 'PROCESSED', processedAt: new Date() },
        });
        break;
      }

      default: {
        await prisma.stripeWebhookEvent.update({
          where: { stripeEventId: event.id },
          data: { processingStatus: 'PROCESSED', processedAt: new Date() },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Stripe Webhook Processing Error] ${err.message}`);

    await prisma.stripeWebhookEvent.update({
      where: { stripeEventId: event.id },
      data: {
        processingStatus: 'FAILED',
        errorDetails: err.message,
      },
    });

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
