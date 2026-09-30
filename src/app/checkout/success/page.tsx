'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'ACM-ALLOCATION-PENDING';
  const { clearCart } = useStore();

  useEffect(() => {
    // Clear shopping bag after successful checkout redirection
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-xl w-full border border-[#E5E5E5] p-8 sm:p-12 bg-white text-center space-y-6">
      <div className="w-14 h-14 bg-[#111111] text-white flex items-center justify-center mx-auto">
        <CheckCircle2 size={28} strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block">
          Payment Authenticated • London Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#111111] tracking-tight uppercase">
          Allocation Confirmed
        </h1>
        <p className="text-xs text-[#767676] font-mono">
          Transaction Identifier: <span className="text-[#111111] font-medium">{sessionId}</span>
        </p>
      </div>

      <div className="w-12 h-[1px] bg-[#E5E5E5] mx-auto" />

      <p className="text-xs sm:text-sm text-[#767676] font-sans leading-relaxed">
        Thank you for acquiring from ACEMEN. Your selected pieces have been reserved from our London vault. Our master artisan is conducting the final inspection and beeswax conditioning before white-glove dispatch.
      </p>

      {/* Courier & Care Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
        <div className="p-4 bg-neutral-50 border border-[#E5E5E5] space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-[#111111]">
            <Truck size={14} />
            <span className="uppercase tracking-wider">Express Courier</span>
          </div>
          <p className="text-[11px] text-[#767676]">
            Complimentary insured global carriage with signature required upon delivery.
          </p>
        </div>

        <div className="p-4 bg-neutral-50 border border-[#E5E5E5] space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-[#111111]">
            <ShieldCheck size={14} />
            <span className="uppercase tracking-wider">Atelier Provenance</span>
          </div>
          <p className="text-[11px] text-[#767676]">
            Accompanied by serial verification document and breathable garment protection.
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium px-8 py-3.5 transition-colors"
        >
          <span>Return to ACEMEN Storefront</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-[#111111]">
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs font-mono uppercase tracking-widest text-[#767676] flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
            <span>Verifying Allocation...</span>
          </div>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
