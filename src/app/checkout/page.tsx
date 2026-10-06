'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { FREE_SHIPPING_THRESHOLD_PENCE } from '@/lib/config';
import CraftsmanshipNote from '@/components/CraftsmanshipNote';

export default function CheckoutPage() {
  const {
    cart,
    getCartSubtotalPence,
    formatPricePence,
    updateQuantity,
    removeFromCart,
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotalPence = getCartSubtotalPence();
  const freeShippingMet = subtotalPence >= FREE_SHIPPING_THRESHOLD_PENCE;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_PENCE - subtotalPence);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckoutError(data.error || 'Failed to initiate checkout. Please try again.');
        setIsCheckingOut(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError('Unexpected response from checkout service.');
        setIsCheckingOut(false);
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'Network connection failed during checkout.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/collection"
            className="inline-flex items-center text-xs tracking-wider uppercase font-mono text-[#767676] hover:text-[#111111] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#8E7E6A]">
            Atelier Secure Checkout
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#EAE4DC] p-12 sm:p-16 text-center max-w-xl mx-auto my-12 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-center mx-auto mb-4 text-[#8E7E6A]">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl font-light text-[#111111] mb-2 tracking-wide">
              Your Shopping Bag is Empty
            </h1>
            <p className="text-xs text-[#767676] max-w-sm mx-auto mb-8 leading-relaxed">
              Explore our handcrafted Goodyear-welted footwear, bespoke jackets, and sartorial leather goods.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              Explore The Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Items Review & Craftsmanship Note */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header */}
              <div className="border-b border-[#EAE4DC] pb-4">
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#8E7E6A] block mb-1">
                  Step 1 of 2 • Order Dossier
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-[#111111]">
                  Review Atelier Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
                </h1>
              </div>

              {/* Items List */}
              <div className="bg-white border border-[#EAE4DC] divide-y divide-[#EAE4DC] shadow-xs">
                {cart.map((item) => {
                  const primaryImage =
                    item.product.images?.find((img) => img.isPrimary) ||
                    item.product.images?.[0];

                  return (
                    <div key={item.id} className="p-4 sm:p-5 flex space-x-4 sm:space-x-5">
                      <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-[#FAF8F5] border border-[#EAE4DC] flex-shrink-0 overflow-hidden">
                        {primaryImage && (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.altText || item.product.title}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 640px) 80px, 96px"
                          />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-serif text-sm sm:text-base text-[#111111] hover:text-[#767676] transition-colors"
                            >
                              {item.product.title}
                            </Link>
                            <span className="font-mono text-xs sm:text-sm text-[#111111] font-medium ml-2">
                              {formatPricePence(item.unitPriceInPence * item.quantity)}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#767676] mt-1 space-x-2">
                            <span>Size: {item.variant.size}</span>
                            <span>•</span>
                            <span>Color: {item.variant.color}</span>
                          </div>

                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            Unit: {formatPricePence(item.unitPriceInPence)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0EBE1]">
                          <div className="flex items-center border border-[#EAE4DC]">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-7 h-7 text-xs text-[#767676] hover:text-[#111111] hover:bg-neutral-100 flex items-center justify-center transition-colors"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-mono text-[#111111]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={item.quantity >= item.variant.stockQuantity}
                              className="w-7 h-7 text-xs text-[#767676] hover:text-[#111111] hover:bg-neutral-100 flex items-center justify-center transition-colors disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="text-[11px] font-mono text-[#8E7E6A] hover:text-[#111111] tracking-wider uppercase transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* A Note on Craftsmanship (Full Luxury Dossier) */}
              <CraftsmanshipNote variant="full" />

              {/* Atelier Commitments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white border border-[#EAE4DC] flex items-start space-x-3">
                  <Truck className="w-4 h-4 text-[#8E7E6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#111111] block mb-0.5">Tracked Express Courier</span>
                    <span className="text-[#767676] text-[11px] leading-relaxed">
                      Complimentary tracked dispatch with discreet luxury packaging.
                    </span>
                  </div>
                </div>
                <div className="p-3.5 bg-white border border-[#EAE4DC] flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-[#8E7E6A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#111111] block mb-0.5">Authenticity Guaranteed</span>
                    <span className="text-[#767676] text-[11px] leading-relaxed">
                      Every order undergoes master atelier inspection before shipment.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout Trigger */}
            <div className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="bg-white border border-[#EAE4DC] p-6 shadow-xs space-y-5">
                <div className="border-b border-[#EAE4DC] pb-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#8E7E6A] block">
                    Financial Summary
                  </span>
                  <h2 className="font-serif text-lg text-[#111111] font-light tracking-wide">
                    Order Total
                  </h2>
                </div>

                {checkoutError && (
                  <div className="p-3 bg-neutral-50 border border-neutral-300 text-xs text-[#111111] flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-neutral-700 flex-shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#767676]">
                    <span>Bag Subtotal</span>
                    <span className="font-mono text-[#111111]">{formatPricePence(subtotalPence)}</span>
                  </div>
                  <div className="flex justify-between text-[#767676]">
                    <span>Global Express Courier</span>
                    <span className="text-[#111111]">
                      {freeShippingMet ? 'Complimentary' : 'Calculated next step'}
                    </span>
                  </div>
                  {FREE_SHIPPING_THRESHOLD_PENCE > 0 && !freeShippingMet && (
                    <div className="text-[10px] text-[#8E7E6A] font-mono">
                      Add {formatPricePence(remainingForFreeShipping)} more for complimentary global courier
                    </div>
                  )}
                  <div className="flex justify-between text-base font-medium pt-3 border-t border-[#EAE4DC] text-[#111111]">
                    <span className="font-serif">Estimated Total</span>
                    <span className="font-mono">{formatPricePence(subtotalPence)}</span>
                  </div>
                  <p className="text-[10px] text-[#767676] font-mono">
                    Duties and local VAT calculated during secure Stripe checkout.
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full min-h-[50px] py-4 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to Stripe...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={12} />
                      <span>Proceed to Stripe Checkout</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-[#F0EBE1] space-y-2 text-center">
                  <div className="text-[10px] text-[#767676] tracking-wider uppercase font-mono">
                    Secure 256-Bit Encrypted Payments via Stripe
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-[10px] text-neutral-400 font-mono">
                    <span>VISA</span>
                    <span>•</span>
                    <span>MASTERCARD</span>
                    <span>•</span>
                    <span>AMEX</span>
                    <span>•</span>
                    <span>APPLE PAY</span>
                  </div>
                </div>
              </div>

              {/* Concierge Support Note */}
              <div className="p-4 bg-[#FAF8F5] border border-[#EAE4DC] text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E7E6A] block mb-1">
                  Atelier Client Concierge
                </span>
                <p className="text-xs text-[#5A554E] leading-relaxed">
                  Have questions regarding leather care, sizing or bespoke delivery?
                </p>
                <a
                  href="mailto:concierge@acemen.co.uk"
                  className="text-xs text-[#111111] font-mono underline hover:text-[#8E7E6A] mt-1 inline-block"
                >
                  concierge@acemen.co.uk
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
