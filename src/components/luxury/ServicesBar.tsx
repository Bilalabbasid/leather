'use client';

import React from 'react';
import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

const services = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
    title: 'Goodyear-Welted Longevity',
    description: 'Lifetime resoling and repair support from our master British cobblers.',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
    title: 'Full-Grain Provenance',
    description: 'Sourced from certified heritage tanneries in Tuscany and Alsace.',
  },
  {
    icon: <Truck className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
    title: 'Complimentary Courier',
    description: 'Insured worldwide door-to-door courier dispatch on all allocations.',
  },
  {
    icon: <Clock className="w-5 h-5 text-[#8C5835] stroke-[1.4]" />,
    title: 'Private Atelier Concierge',
    description: 'Bespoke commissions and size consultation available 7 days a week.',
  },
];

export default function ServicesBar() {
  return (
    <section className="py-12 bg-white border-y border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s) => (
            <div key={s.title} className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#111111]">
                  {s.title}
                </h4>
                <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
