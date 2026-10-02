'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function CraftsmanshipFeature() {
  return (
    <section className="py-20 sm:py-32 bg-[#FAF8F5] overflow-hidden border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Atelier Studio Photography */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-white overflow-hidden shadow-xl border border-[#E5E5E5]">
              <Image
                src="/images/luxury/craftsmanship.webp"
                alt="Master Artisan Hand Saddle-Stitching in ACEMEN London Atelier"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Architectural Floating Inset Accent */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#080808] text-white p-6 max-w-xs shadow-2xl border border-neutral-800">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#DFC278] uppercase font-bold block mb-1">
                SAVOIR-FAIRE
              </span>
              <p className="font-serif text-sm italic text-neutral-200">
                &ldquo;Forty-two individual hand operations behind every single creation.&rdquo;
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono font-bold tracking-[0.35em] uppercase text-[#8C5835] block">
              THE ART OF SADDLE STITCHING
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#111111] leading-[1.15]">
              TIMELESS LEATHER ARCHITECTURE
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
              <p>
                In an era dominated by automated mass-production, ACEMEN remains staunchly committed to the traditions of pure bench artisanry. Each hide is hand-selected from heritage European tanneries in Tuscany and Alsace, ensuring unyielding tensile strength, natural grain depth, and an evolving patina.
              </p>
              <p>
                Our master leatherworkers utilize two-needle saddle stitching coated in organic beeswax, hand-beveled edges sealed with multiple coats of natural ink, and milled solid brass hardware.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/ace"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-[#111111] border-b border-[#111111] pb-1 hover:text-[#8C5835] hover:border-[#8C5835] transition-colors"
              >
                <span>Discover Our Savoir-Faire</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
