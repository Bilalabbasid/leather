'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, ArrowRight, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { FREE_SHIPPING_THRESHOLD_PENCE } from '@/lib/config';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getCartSubtotalPence,
    formatPricePence,
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Prevent background scroll when cart drawer is active
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

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
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bag-drawer-title"
      onClick={closeCart}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-full sm:max-w-md bg-white border-l border-[#E5E5E5] flex flex-col justify-between shadow-2xl"
        >
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#E5E5E5] flex items-center justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] block">
                Atelier Orders
              </span>
              <h2
                id="bag-drawer-title"
                className="font-serif text-lg tracking-wide uppercase font-light text-[#111111]"
              >
                Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="text-[#767676] hover:text-[#111111] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
              aria-label="Close shopping bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Configurable Free Shipping Progress */}
          {FREE_SHIPPING_THRESHOLD_PENCE > 0 && cart.length > 0 && (
            <div className="px-6 py-3 bg-neutral-50 border-b border-[#E5E5E5] text-[11px] font-sans">
              {freeShippingMet ? (
                <div className="text-[#111111] font-medium tracking-wide">
                  ✓ Complimentary White-Glove Courier Delivery Qualified
                </div>
              ) : (
                <div className="text-[#767676]">
                  Add <span className="text-[#111111] font-mono font-medium">{formatPricePence(remainingForFreeShipping)}</span> more for complimentary global courier
                </div>
              )}
              <div className="w-full bg-neutral-200 h-1 mt-2 overflow-hidden">
                <div
                  className="bg-[#111111] h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (subtotalPence / FREE_SHIPPING_THRESHOLD_PENCE) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E5E5E5]">
            {cart.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <span className="font-serif text-xl font-light text-[#767676] mb-3">
                  Your bag is currently empty.
                </span>
                <p className="text-xs text-neutral-400 max-w-xs mb-6 tracking-wide">
                  Explore our limited bespoke allocations of leather jackets and footwear.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-[#111111] text-white text-xs uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const primaryImage =
                  item.product.images?.find((img) => img.isPrimary) ||
                  item.product.images?.[0];

                return (
                  <div key={item.id} className="py-4 flex space-x-4">
                    {/* Item Thumbnail */}
                    <div className="relative w-20 h-24 bg-neutral-50 border border-[#E5E5E5] flex-shrink-0 overflow-hidden">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.altText || item.product.title}
                          fill
                          className="object-cover object-center"
                          sizes="80px"
                        />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-serif text-sm text-[#111111] hover:text-[#767676] transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          <span className="font-mono text-xs text-[#111111]">
                            {formatPricePence(item.unitPriceInPence * item.quantity)}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#767676] mt-0.5 space-x-2">
                          <span>Size: {item.variant.size}</span>
                          <span>•</span>
                          <span>{item.variant.color}</span>
                        </div>

                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          Unit: {formatPricePence(item.unitPriceInPence)}
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E5E5E5]">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-8 h-8 text-xs text-[#767676] hover:text-[#111111] hover:bg-neutral-100 flex items-center justify-center transition-colors min-h-[36px] min-w-[36px]"
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
                            className="w-8 h-8 text-xs text-[#767676] hover:text-[#111111] hover:bg-neutral-100 flex items-center justify-center transition-colors min-h-[36px] min-w-[36px] disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-[#767676] hover:text-[#111111] p-2 min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#E5E5E5] bg-white space-y-4">
              {checkoutError && (
                <div className="p-3 bg-neutral-50 border border-neutral-300 text-xs text-[#111111] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-neutral-700 flex-shrink-0 mt-0.5" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#767676]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#111111]">{formatPricePence(subtotalPence)}</span>
                </div>
                <div className="flex justify-between text-[#767676]">
                  <span>Delivery</span>
                  <span>{freeShippingMet ? 'Complimentary Courier' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-[#E5E5E5] text-[#111111]">
                  <span className="font-serif">Estimated Total</span>
                  <span className="font-mono">{formatPricePence(subtotalPence)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full min-h-[50px] py-3.5 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock size={12} />
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-[#767676] tracking-wider uppercase font-mono">
                Secure 256-Bit Encrypted Payments via Stripe
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
