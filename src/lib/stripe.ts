import Stripe from 'stripe';

export function getStripeClient(customKey?: string): Stripe {
  const stripeSecretKey =
    customKey?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim() ||
    'sk_test_placeholder';

  return new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20.acacia' as any,
    typescript: true,
  });
}

export const stripe = getStripeClient();

