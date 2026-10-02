'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Palette,
  Sparkles,
  Scissors,
  Footprints,
  Maximize2,
  Shield,
  Feather,
  Bookmark,
  Tag,
  Package,
  ArrowRight,
} from 'lucide-react';

interface SpecElement {
  title: string;
  options: string;
  icon: React.ReactNode;
}

const customizationElements: SpecElement[] = [
  {
    title: '1. Leather & Hide Selection',
    options: 'French Box Calf, Bavarian Cowhide, Tuscan Veg-Tan, Suede, Nubuck, Top-Grain',
    icon: <Layers className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '2. Color & Custom Dye',
    options: 'Pantone Color Matching, Aniline Dip Dyes, Bespoke Multi-Tone Museum Patinas',
    icon: <Palette className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '3. Surface Finishes',
    options: 'High-Gloss Mirror Glaze, Hand-Burnished, Antique Patina, Pebbled Grain, Waxy Pull-Up',
    icon: <Sparkles className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '4. Upper Silhouette & Pattern',
    options: 'Seamless Wholecut, Cap-Toe, Plain-Toe, Wingtip Brogue, Double Monk, Chelsea, Derby',
    icon: <Scissors className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '5. Stitching & Edge Inking',
    options: 'Two-Needle Hand Saddle Stitch, Contrast Stitching, French Seams, Beveled Inked Edges',
    icon: <Scissors className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '6. Sole Construction',
    options: 'Goodyear Welted Closed-Channel Leather Sole, Dainite Studded Rubber, Vibram Commando',
    icon: <Footprints className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '7. Heel Profiles',
    options: 'Stacked Leather Cuban, Classic British 25mm Stack, Beveled Waist, Rubber Top-Piece',
    icon: <Maximize2 className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '8. Hardware & Metalwork',
    options: 'Milled Solid Brass, Gunmetal, Polished Palladium, Swiss Riri Zips',
    icon: <Shield className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '9. Interior Lining',
    options: 'Ultra-Soft Glove Calfskin, Breathable Cupro Silk, Thermal Spanish Merino Wool',
    icon: <Feather className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '10. Insole & Arch Support',
    options: 'Full Leather Sockliner, Orthotic Arch Footbed, High-Density Memory Foam, Perforated Forefoot',
    icon: <Bookmark className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '11. Private Atelier Monogramming',
    options: '24k Gold Foil Debossing, Blind Insole Stamp, Custom Monogrammed Plaque, Laser Sole Engraving',
    icon: <Tag className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
  {
    title: '12. Bespoke Packaging',
    options: 'Custom Rigid Gift Box, Printed Heavy Cotton Dust Bags, Solid Cedar Shoe Trees',
    icon: <Package className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
  },
];

export default function BespokeSection() {
  return (
    <section id="bespoke" className="py-20 sm:py-28 bg-[#080808] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,168,105,0.08),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="max-w-3xl mb-14 sm:mb-18 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[#DFC278]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.35em] uppercase text-[#DFC278]">
              ACE • BESPOKE COMMISSIONS
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight uppercase">
            Made To Your Exact Specification
          </h2>

          <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-2xl">
            From one-of-one private allocations to individual tech pack bespoke tailoring, ACEMEN executes each commission with uncompromised precision.
          </p>
        </div>

        {/* 12-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {customizationElements.map((el) => (
            <div
              key={el.title}
              className="p-6 bg-[#141414] border border-neutral-800 space-y-3 hover:border-[#8C5835] transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#1C1C1C] flex items-center justify-center">
                {el.icon}
              </div>
              <h4 className="font-serif text-base font-medium text-white">
                {el.title}
              </h4>
              <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
                {el.options}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-800 pt-8 gap-4">
          <div className="text-xs text-neutral-400">
            Private Client Concierge: <span className="text-white font-medium">info@acemen.co.uk</span>
          </div>
          <Link
            href="/ace"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-white border-b border-white pb-1 hover:text-[#DFC278] hover:border-[#DFC278] transition-colors"
          >
            <span>Commission Bespoke Garment or Footwear</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
