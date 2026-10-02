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
            <Link href="/" className="flex items-center gap-3.5 mb-4 group">
              <img
                src="/images/logo.png"
                alt="ACEMEN"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-[0.25em] font-light uppercase text-white block leading-none">
                  ACEMEN
                </span>
                <span className="text-[8px] font-sans tracking-[0.35em] text-[#C5A869] uppercase block mt-1">
                  LONDON • ATELIER
                </span>
              </div>
            </Link>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm mb-6">
              ACEMEN is a British luxury leather house and master footwear atelier incorporated in the United Kingdom. We craft fine Goodyear-welted shoes, outerwear, holdalls, and small leather goods available by pre-order, private allocation, and bespoke commission.
            </p>
            <div className="text-[11px] text-neutral-400 font-mono tracking-widest space-y-1">
              <p className="text-white font-sans text-xs font-medium">London Headquarters & Atelier</p>
              <p>551 Staines Road, Hounslow, Middlesex</p>
              <p>London TW4 5DL, United Kingdom</p>
              <div className="pt-2 flex items-center space-x-3 text-xs">
                <a href="mailto:info@acemen.co.uk" className="text-white hover:text-[#C5A869] transition-colors">info@acemen.co.uk</a>
                <span className="text-neutral-600">•</span>
                <a href="tel:+447587386522" className="text-white hover:text-[#C5A869] transition-colors">+44 7587 386522</a>
              </div>
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
                <Link href="/track-order" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A869]"></span>
                  <span>Track Order & Delivery</span>
                </Link>
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
            © {new Date().getFullYear()} ACEMEN LIMITED. LONDON, UNITED KINGDOM • ACEMEN.CO.UK
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
