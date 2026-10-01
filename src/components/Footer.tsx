'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-[#111111] text-[#E5E5E5] pt-16 pb-12 border-t border-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-14 border-b border-neutral-800">
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-3xl tracking-[0.25em] font-light uppercase text-white block">
                ACEMEN
              </span>
              <span className="text-[9px] font-sans tracking-[0.35em] text-neutral-400 uppercase block -mt-0.5">
                LONDON • ATELIER
              </span>
            </Link>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm mb-6">
              Rooted in the quiet pursuit of permanence. Handcrafted leather jackets, Goodyear-welted footwear, and architectural travel luggage sculpted from the rarest hides in Europe. London atelier founded on uncompromising provenance.
            </p>
            <div className="text-[11px] text-neutral-400 font-mono tracking-widest space-y-1">
              <p>Mayfair Atelier & Showroom</p>
              <p>12 Savile Row, London W1S 3PQ</p>
              <p className="text-white pt-1">concierge@acemen.uk</p>
            </div>
          </div>

          {/* Column 1: Collections */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-mono text-white mb-4">
              Atelier Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-sans tracking-wide">
              <li>
                <Link href="/collection/leather-jackets" className="hover:text-white transition-colors">
                  Leather Jackets
                </Link>
              </li>
              <li>
                <Link href="/collection/shoes" className="hover:text-white transition-colors">
                  Signature Footwear
                </Link>
              </li>
              <li>
                <Link href="/collection/bags" className="hover:text-white transition-colors">
                  Luggage & Weekenders
                </Link>
              </li>
              <li>
                <Link href="/collection/wallets-small-leather-goods" className="hover:text-white transition-colors">
                  Small Leather Goods
                </Link>
              </li>
              <li>
                <Link href="/collection/all" className="hover:text-white transition-colors">
                  Complete Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Client Services */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-mono text-white mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-sans tracking-wide">
              <li>
                <span className="hover:text-white transition-colors">
                  Private Salon Appointments
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Courier Delivery & Returns
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Lifetime Structural Warranty
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors">
                  Leather Preservation Guide
                </span>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Staff Atelier CMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Private Allocation Registry */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.25em] font-mono text-white mb-4">
              Private Registry
            </h4>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Confidential notifications for bespoke allocations and limited tannery releases.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="client@domain.com"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors font-sans"
              />
              <button
                type="submit"
                className="w-full py-2 bg-white text-[#111111] hover:bg-neutral-200 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors"
              >
                Request Inclusion
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Legal & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono tracking-wider space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} ACEMEN LIMITED. ALL RIGHTS RESERVED. ACEMEN.UK
          </div>
          <div className="flex space-x-6 text-[10px] uppercase tracking-widest">
            <span>Privacy Policy</span>
            <span>Terms of Atelier Service</span>
            <span>Ethical Tanneries</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
