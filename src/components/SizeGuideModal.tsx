'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function SizeGuideModal() {
  const { sizeGuideCategory, closeSizeGuide } = useStore();
  const [tab, setTab] = useState<'jackets' | 'shoes'>('jackets');

  React.useEffect(() => {
    if (sizeGuideCategory && (sizeGuideCategory.includes('shoes') || sizeGuideCategory.includes('boot') || sizeGuideCategory === 'footwear')) {
      setTab('shoes');
    } else {
      setTab('jackets');
    }
  }, [sizeGuideCategory]);

  if (!sizeGuideCategory) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-modal-title"
    >
      <div className="relative bg-white max-w-2xl w-full p-6 sm:p-8 border border-[#E5E5E5] shadow-2xl z-10 animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center space-x-2">
            <Ruler size={16} className="text-[#111111]" />
            <h3 id="size-guide-modal-title" className="font-serif text-xl tracking-wider text-[#111111] uppercase font-light">
              ACEMEN Atelier Measurement Matrix
            </h3>
          </div>
          <button
            onClick={closeSizeGuide}
            className="text-[#767676] hover:text-[#111111] p-1 transition-colors"
            aria-label="Close size guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-4 my-6 border-b border-[#E5E5E5] text-xs uppercase tracking-widest font-mono">
          <button
            onClick={() => setTab('jackets')}
            className={`pb-2.5 transition-colors ${
              tab === 'jackets'
                ? 'text-[#111111] border-b-2 border-[#111111] font-semibold'
                : 'text-[#767676] hover:text-[#111111]'
            }`}
          >
            Outerwear Sizing (S – XXL)
          </button>
          <button
            onClick={() => setTab('shoes')}
            className={`pb-2.5 transition-colors ${
              tab === 'shoes'
                ? 'text-[#111111] border-b-2 border-[#111111] font-semibold'
                : 'text-[#767676] hover:text-[#111111]'
            }`}
          >
            Footwear & Boots (UK · US · EU)
          </button>
        </div>

        {/* Tables */}
        {tab === 'jackets' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-[#111111] uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">Size</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">Chest (Inches)</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">Pit-to-Pit (cm)</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">Shoulder (cm)</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">Sleeve (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-[#767676]">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">38R (Small)</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">36&quot; - 38&quot;</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">52.5 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">45.0 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">64.0 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">40R (Medium)</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">39&quot; - 41&quot;</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">55.0 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">46.5 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">65.5 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">42R (Large)</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">42&quot; - 44&quot;</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">57.5 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">48.0 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">67.0 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">44R (Extra Large / XL)</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">45&quot; - 47&quot;</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">60.0 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">49.5 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">68.0 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">46R (XXL)</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">48&quot; - 50&quot;</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">62.5 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">51.0 cm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">69.0 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-[#111111] uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">UK</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">EU</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">US</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">Foot Length (mm)</th>
                  <th className="py-2.5 px-3 border border-[#E5E5E5]">Width Fitting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-[#767676]">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">UK 7</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">41</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">8</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">258 mm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">F (Standard)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">UK 8</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">42</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">9</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">266 mm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">F (Standard)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">UK 9</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">43</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">10</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">275 mm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">F (Standard)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">UK 10</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">44</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">11</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">283 mm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">F (Standard)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#111111] border border-[#E5E5E5]">UK 11</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">45</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">12</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">292 mm</td>
                  <td className="py-2.5 px-3 border border-[#E5E5E5]">F (Standard)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#767676]">
          <span>Need custom Savile Row sizing guidance?</span>
          <span className="font-mono text-[#111111]">concierge@acemen.uk</span>
        </div>
      </div>
    </div>
  );
}
