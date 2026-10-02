'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface LeatherType {
  name: string;
  category: string;
  characteristics: string;
  recommendedFor: string;
  finishType: string;
}

const leatherTypes: LeatherType[] = [
  {
    name: 'Full-Grain French Box Calfskin',
    category: 'Premier Grade',
    characteristics: 'Tight grain structure, smooth hand-feel, develops rich natural lustre with mirror wax polishing.',
    recommendedFor: 'Formal Oxfords, Plain-Toe Derbies, Executive Wallets',
    finishType: 'Smooth / Glazed Mirror',
  },
  {
    name: 'Bavarian Full-Grain Cowhide',
    category: 'Heavyweight Sartorial',
    characteristics: 'Dense fiber density, exceptional tensile resilience, outstanding weather resistance and durability.',
    recommendedFor: 'Chelsea Boots, Double Monk Straps, Holdall Duffels',
    finishType: 'Burnished / Aniline',
  },
  {
    name: 'Tuscan Vegetable-Tanned Hide',
    category: 'Generational Patina',
    characteristics: 'Slow tree-bark tanned, organic vegetable dye penetration, gains deep character through oxidation.',
    recommendedFor: 'Briefcases, Luggage Handles, Sartorial Belts',
    finishType: 'Antique Patina / Pull-Up',
  },
  {
    name: 'Velvety Calf Suede & Nubuck',
    category: 'Soft Suede Finish',
    characteristics: 'Supple buffed nap with Scotchgard water-repellent pre-treatment option for daily comfort.',
    recommendedFor: 'Casual Monks, Loafers, Bomber Jacket Accents',
    finishType: 'Brushed Nap / Water-Shield',
  },
  {
    name: 'Top-Grain Smooth Leather',
    category: 'Commercial Uniformity',
    characteristics: 'Uniform surface grain with flexible temper, ideal for high-volume consistent private-label runs.',
    recommendedFor: 'Executive Footwear, Tailored Uniform Shoes',
    finishType: 'High-Gloss / Semi-Matte',
  },
  {
    name: 'Pebble & Embossed Grain Leather',
    category: 'Textured Durability',
    characteristics: 'Mechanical hatch and pebble grain embossing, highly scratch-resistant and supple.',
    recommendedFor: 'Winter Brogues, All-Weather Boots, Travel Trunks',
    finishType: 'Pebbled / Cross-Hatch',
  },
];

const customizableFinishes = [
  { name: 'Smooth Mirror Glaze', desc: 'High-friction wax burnishing on toe-cap and heel counters.' },
  { name: 'Hand-Burnished Antique', desc: 'Layered pigment inking to highlight stitch lines and brogue perforations.' },
  { name: 'Museum Marble Patina', desc: 'Artisanal sponge and brush dye application creating organic stone marbling.' },
  { name: 'Pebbled & Hatch Grain', desc: 'Textured tactile finish offering high resistance to daily scuffs.' },
  { name: 'Waxy Pull-Up Oiled', desc: 'Infused with natural waxes that shift tone when creased or flexed.' },
  { name: 'Embossed Exotic Textures', desc: 'Precision plate-stamped patterns including mock crocodile and lizard.' },
  { name: 'Brushed Suede & Nubuck', desc: 'Micro-velvet sanded nap with supple drape and rich color saturation.' },
  { name: 'Weatherproof Sealed Edges', desc: 'Five-step hand-inked edge seal with heat burnishing for moisture barrier.' },
];

export default function MaterialsSection() {
  const [activeTab, setActiveTab] = useState<'materials' | 'finishes'>('materials');

  return (
    <section id="materials" className="py-20 sm:py-28 bg-[#FCFBF8] border-y border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 space-y-3">
          <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#8C5835] block font-semibold">
            MATERIAL PROVENANCE & FINISHING
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide text-[#111111] uppercase">
            Premier European Leathers & Finishes
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed max-w-xl mx-auto">
            From premier European full-grain hides to bespoke hand-burnished patinas, ACEMEN crafts with uncompromising provenance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <div className="inline-flex p-1 bg-white border border-[#E5E5E5] shadow-xs">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-6 py-2.5 text-xs font-mono font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'materials'
                  ? 'bg-[#111111] text-white'
                  : 'text-neutral-600 hover:text-[#111111]'
              }`}
            >
              European Leathers
            </button>
            <button
              onClick={() => setActiveTab('finishes')}
              className={`px-6 py-2.5 text-xs font-mono font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'finishes'
                  ? 'bg-[#111111] text-white'
                  : 'text-neutral-600 hover:text-[#111111]'
              }`}
            >
              Artisanal Finishes
            </button>
          </div>
        </div>

        {/* Tab Content: Materials */}
        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leatherTypes.map((leather) => (
              <div
                key={leather.name}
                className="bg-white p-7 border border-[#E5E5E5] flex flex-col justify-between hover:border-[#111111] transition-all hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#8C5835] font-semibold">
                      {leather.category}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5">
                      {leather.finishType}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#111111] group-hover:text-[#8C5835] transition-colors">
                    {leather.name}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    {leather.characteristics}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-500 font-mono">Ideal for:</span>
                  <span className="text-[11px] font-medium text-[#111111] text-right">
                    {leather.recommendedFor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Finishes */}
        {activeTab === 'finishes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customizableFinishes.map((finish) => (
              <div
                key={finish.name}
                className="bg-white p-6 border border-[#E5E5E5] space-y-2.5 hover:border-[#111111] transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E5E5E5] flex items-center justify-center text-[#8C5835]">
                  <Sparkles size={14} />
                </div>
                <h4 className="font-serif text-base font-medium text-[#111111]">
                  {finish.name}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {finish.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/ace"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-[#111111] border-b border-[#111111] pb-1 hover:text-[#8C5835] hover:border-[#8C5835] transition-colors"
          >
            <span>Learn About Our Tanneries & ACE Bespoke</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
