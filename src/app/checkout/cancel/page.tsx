'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center py-16 px-4 text-[#111111]">
      <div className="max-w-md w-full border border-[#E5E5E5] p-8 text-center space-y-5 bg-white">
        <div className="w-12 h-12 bg-neutral-100 text-[#111111] flex items-center justify-center mx-auto">
          <ShoppingBag size={20} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl uppercase tracking-wider text-[#111111]">
          Checkout Suspended
        </h1>
        <p className="text-xs text-[#767676] leading-relaxed">
          Your shopping bag items remain safely preserved in your private session. You may resume your order at any moment.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-[#111111] text-white text-xs uppercase tracking-widest px-6 py-3 font-medium hover:bg-black transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Collection</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
