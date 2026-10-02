'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function FootwearFeature() {
  return (
    <section className="relative py-24 sm:py-36 bg-[#080808] text-white overflow-hidden flex items-center justify-center">
      {/* Background Campaign Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/luxury/footwear-campaign.webp"
          alt="The ACEMEN Hand-Lasted Footwear Atelier"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-[#080808]/70" />
      </div>

      {/* Editorial Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4 sm:space-y-6">
        <span className="text-[10px] font-mono font-semibold tracking-[0.35em] uppercase text-[#DFC278] block">
          FROM CONCEPT TO FINISHED PAIR
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-tight">
          THE FOOTWEAR ATELIER
        </h2>

        <p className="font-sans text-neutral-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto">
          Goodyear-welted British Oxfords, wholecut Chelsea boots, and hand-burnished double monks crafted across 212 independent hand operations.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/collection/shoes"
            className="bg-white text-[#111111] hover:bg-neutral-100 text-xs uppercase tracking-[0.2em] font-medium px-8 py-3.5 transition-colors inline-flex items-center space-x-2"
          >
            <span>Explore Footwear</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            href="/ace"
            className="bg-transparent hover:bg-white/10 text-white border border-white/60 hover:border-white text-xs uppercase tracking-[0.2em] font-medium px-8 py-3.5 transition-colors"
          >
            <span>Bespoke Commission</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
