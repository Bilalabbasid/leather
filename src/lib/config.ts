import { CommerceMode, Currency } from './types';

export const BRAND_NAME = 'ACEMEN';
export const DOMAIN = 'acemen.uk';
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://acemen.uk';
export const CONCIERGE_EMAIL = 'concierge@acemen.uk';

// Free shipping threshold in pence (e.g. £500.00 = 50,000 pence)
export const FREE_SHIPPING_THRESHOLD_PENCE = 50000;

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  GBP: { symbol: '£', rate: 1.0 },
  USD: { symbol: '$', rate: 1.28 },
  EUR: { symbol: '€', rate: 1.18 },
};

/**
 * Converts integer pence to formatted currency string.
 * Example: 185000 pence GBP -> "£1,850"
 */
export function formatPence(
  pence: number,
  currency: Currency = 'GBP',
  options: { showCents?: boolean } = {}
): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.GBP;
  const majorUnits = (pence / 100) * config.rate;

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: options.showCents ? 2 : 0,
    maximumFractionDigits: options.showCents ? 2 : 0,
  });

  return formatter.format(majorUnits);
}
