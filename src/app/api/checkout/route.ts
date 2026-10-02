import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const checkoutInputSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1, 'Variant ID is required'),
        quantity: z.number().int().positive('Quantity must be at least 1').max(10, 'Max 10 units per line item'),
      })
    )
    .min(1, 'At least one item is required in the shopping bag'),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = checkoutInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid shopping bag payload',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { items } = parseResult.data;

    // 1. Re-fetch variants, products, prices, and stock from the database
    const variantIds = items.map((i) => i.variantId);
    const dbVariants = await prisma.variant.findMany({
      where: {
        id: { in: variantIds },
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });

    if (dbVariants.length !== items.length) {
      return NextResponse.json(
        { error: 'One or more items in your shopping bag are no longer available.' },
        { status: 400 }
      );
    }

    // Dynamic host detection for accurate redirection across localhost and production domains
    const reqHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const reqProto = req.headers.get('x-forwarded-proto') || 'https';
    const detectedUrl = reqHost ? `${reqProto}://${reqHost}` : undefined;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || detectedUrl || 'https://acemen.co.uk';

    let subtotalInPence = 0;
    const verifiedLineItems: Array<{
      variant: (typeof dbVariants)[0];
      quantity: number;
      unitPriceInPence: number;
      lineTotalInPence: number;
    }> = [];

    const stripeLineItems: any[] = [];

    // 2. Validate stock, active status, and calculate server-side totals
    for (const item of items) {
      const variant = dbVariants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} was not found.` },
          { status: 400 }
        );
      }

      if (!variant.isActive || variant.product.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: `"${variant.product.title}" (${variant.size}) is currently unavailable.` },
          { status: 400 }
        );
      }

      if (variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${variant.product.title}" (${variant.size}). Only ${variant.stockQuantity} piece(s) available.`,
          },
          { status: 400 }
        );
      }

      const unitPriceInPence = variant.priceOverrideInPence ?? variant.product.priceInPence;
      const lineTotalInPence = unitPriceInPence * item.quantity;
      subtotalInPence += lineTotalInPence;

      verifiedLineItems.push({
        variant,
        quantity: item.quantity,
        unitPriceInPence,
        lineTotalInPence,
      });

      const primaryImg =
        variant.product.images.find((img) => img.isPrimary) || variant.product.images[0];
      // Stripe requires images to be public HTTPS URLs. If not https, omit to avoid rejection.
      const imageUrl =
        primaryImg?.url && primaryImg.url.startsWith('https://')
          ? primaryImg.url
          : undefined;

      stripeLineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${variant.product.title} — ${variant.size}`,
            description: `${variant.product.leatherGrade || variant.product.material} • Color: ${variant.color}`,
            images: imageUrl ? [imageUrl] : [],
            metadata: {
              productId: variant.productId,
              variantId: variant.id,
              sku: variant.sku,
            },
          },
          unit_amount: unitPriceInPence,
        },
        quantity: item.quantity,
      });
    }

    // 3. Check Stripe credentials (trim and support sk_ and rk_ keys)
    const rawStripeKey = process.env.STRIPE_SECRET_KEY;
    const stripeKey = rawStripeKey?.trim();
    const isStripeConfigured =
      !!stripeKey &&
      !stripeKey.includes('mock') &&
      !stripeKey.includes('placeholder') &&
      (stripeKey.startsWith('sk_test_') ||
        stripeKey.startsWith('sk_live_') ||
        stripeKey.startsWith('rk_test_') ||
        stripeKey.startsWith('rk_live_'));

    if (!isStripeConfigured) {
      return NextResponse.json(
        {
          error:
            'Stripe payment gateway is currently unconfigured. Please configure a valid STRIPE_SECRET_KEY in server environment to enable live checkout.',
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    // 4. Create pending order in database
    const orderNumber = `ACM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const pendingOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: 'pending-checkout@acemen.co.uk',
        subtotalInPence,
        totalInPence: subtotalInPence,
        currency: 'GBP',
        status: 'PENDING',
        orderItems: {
          create: verifiedLineItems.map((v) => ({
            productId: v.variant.productId,
            variantId: v.variant.id,
            title: v.variant.product.title,
            sku: v.variant.sku,
            size: v.variant.size,
            color: v.variant.color,
            unitPriceInPence: v.unitPriceInPence,
            quantity: v.quantity,
            lineTotalInPence: v.lineTotalInPence,
          })),
        },
      },
    });

    // 5. Create Stripe Checkout Session with worldwide luxury delivery support
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      mode: 'payment',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: [
          'GB', 'US', 'FR', 'DE', 'IT', 'CH', 'AE', 'CA', 'AU', 'JP',
          'ES', 'NL', 'SE', 'DK', 'NO', 'BE', 'AT', 'IE', 'SA', 'QA', 'SG', 'HK'
        ],
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${pendingOrder.id}`,
      cancel_url: `${appUrl}/checkout/cancel?order_id=${pendingOrder.id}`,
      metadata: {
        orderId: pendingOrder.id,
        orderNumber: pendingOrder.orderNumber,
      },
    });

    // Update order with Stripe Session ID
    await prisma.order.update({
      where: { id: pendingOrder.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderNumber: pendingOrder.orderNumber,
    });
  } catch (err: any) {
    console.error('[Checkout Error]', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during checkout initialization.' },
      { status: 500 }
    );
  }
}
