import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface CraftsmanshipNoteProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export default function CraftsmanshipNote({
  className = '',
  variant = 'compact',
}: CraftsmanshipNoteProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`bg-[#FAF8F5] border border-[#EAE4DC] p-3.5 sm:p-4 text-[#2C2925] ${className}`}
        role="region"
        aria-label="A Note on Craftsmanship"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8E7E6A] flex-shrink-0" />
          <h3 className="font-serif text-xs uppercase tracking-[0.16em] font-medium text-[#1A1A1A]">
            A Note on Craftsmanship
          </h3>
        </div>

        <div className="space-y-1.5 text-[11px] sm:text-[11.5px] leading-relaxed text-[#5A554E]">
          <p>
            Every Acemen piece is individually handcrafted from natural leather. Due to the unique
            characteristics of genuine leather and our hand-finishing process, slight variations in
            colour, texture and grain may occur, with colour variations of up to ±5% possible.
          </p>
          <p className="text-[#3A3733] font-medium">
            These natural variations are an inherent part of the craftsmanship, making each Acemen
            piece truly unique.
          </p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#EAE4DC]/70 flex items-center justify-between text-[9px] font-mono tracking-wider uppercase text-[#8E7E6A]">
          <span className="flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-[#8E7E6A]" />
            Natural Leather
          </span>
          <span>±5% Colour Variance</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#FAF8F5] border border-[#EAE4DC] p-5 sm:p-6 text-[#2C2925] shadow-xs ${className}`}
      role="region"
      aria-label="A Note on Craftsmanship"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE4DC]/80 mb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-[#F0EBE1] flex items-center justify-center text-[#8E7E6A]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8E7E6A] block">
              Atelier Provenance
            </span>
            <h3 className="font-serif text-sm sm:text-base tracking-wide text-[#1A1A1A] font-normal">
              A Note on Craftsmanship
            </h3>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono text-[#8E7E6A] tracking-wider uppercase bg-[#F0EBE1]/70 px-2.5 py-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Bespoke Handcrafted</span>
        </div>
      </div>

      <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed text-[#5A554E]">
        <p>
          Every Acemen piece is individually handcrafted from natural leather. Due to the unique
          characteristics of genuine leather and our hand-finishing process, slight variations in
          colour, texture and grain may occur, with colour variations of up to ±5% possible.
        </p>
        <p className="text-[#2C2925] font-medium">
          These natural variations are an inherent part of the craftsmanship, making each Acemen
          piece truly unique.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EAE4DC]/70 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono tracking-wider uppercase text-[#8E7E6A]">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8E7E6A]" />
          <span>Natural Full Grain</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8E7E6A]" />
          <span>Hand-Finished</span>
        </div>
        <div className="col-span-2 sm:col-span-1 flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8E7E6A]" />
          <span>±5% Hue Variance</span>
        </div>
      </div>
    </div>
  );
}
