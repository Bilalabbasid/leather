'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { INITIAL_PRODUCTS } from '@/lib/data';

export default function SearchModal() {
  const { isSearchOpen, closeSearch, formatPricePence } = useStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.leatherGrade && p.leatherGrade.toLowerCase().includes(q)) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.styleCode.toLowerCase().includes(q)
    );
  }, [query]);

  const quickTags = ['Biker Jackets', 'Shearling', 'Oxford Shoes', 'Chelsea Boots', 'Weekender Duffel'];

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div
        onClick={closeSearch}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      />

      <div className="relative max-w-2xl mx-auto mt-16 sm:mt-24 px-4">
        <div className="bg-white border border-[#E5E5E5] shadow-2xl overflow-hidden">
          {/* Input Section */}
          <div className="p-4 sm:p-5 border-b border-[#E5E5E5] flex items-center space-x-3">
            <Search size={18} className="text-[#767676]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by leather grade, silhouette, or style code..."
              className="flex-1 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-[11px] font-mono text-[#767676] hover:text-[#111111] px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeSearch}
              className="text-[#767676] hover:text-[#111111] p-1 transition-colors"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="px-5 py-2.5 bg-neutral-50 border-b border-[#E5E5E5] flex items-center space-x-2 overflow-x-auto text-[10px]">
            <span className="text-[#767676] uppercase tracking-wider font-mono mr-1">
              Curated:
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2 py-0.5 bg-white border border-[#E5E5E5] hover:border-[#111111] text-[#767676] hover:text-[#111111] transition-colors whitespace-nowrap uppercase tracking-wider font-mono"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="max-h-[55vh] overflow-y-auto p-4 sm:p-5">
            {query.trim() === '' ? (
              <div className="py-10 text-center">
                <p className="text-xs uppercase tracking-widest font-mono text-[#767676]">
                  Search across ACEMEN bespoke leather allocations
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-serif text-lg text-[#111111] uppercase tracking-wider mb-1">
                  No Atelier Matches Found
                </p>
                <p className="text-xs text-[#767676]">
                  Try searching for steerhide, calfskin, boots, oxford, or jackets.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#767676]">
                  {filtered.length} {filtered.length === 1 ? 'Match' : 'Matches'} Found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.map((item) => {
                    const primaryImg =
                      item.images.find((img) => img.isPrimary) || item.images[0];
                    return (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        onClick={closeSearch}
                        className="group flex space-x-3 p-2.5 border border-[#E5E5E5] hover:border-[#111111] transition-colors bg-white"
                      >
                        <div className="relative w-14 h-18 bg-neutral-50 border border-[#E5E5E5] flex-shrink-0 overflow-hidden">
                          {primaryImg && (
                            <Image
                              src={primaryImg.url}
                              alt={item.title}
                              fill
                              sizes="56px"
                              className="object-cover object-center"
                            />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest font-mono text-[#767676] truncate">
                              {item.styleCode}
                            </p>
                            <h4 className="font-serif text-xs font-normal text-[#111111] group-hover:text-neutral-600 truncate">
                              {item.title}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-[#111111]">
                              {formatPricePence(item.priceInPence)}
                            </span>
                            <ArrowUpRight
                              size={12}
                              className="text-neutral-400 group-hover:text-[#111111] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
