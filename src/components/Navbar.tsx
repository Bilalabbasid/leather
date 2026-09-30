'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, ShieldCheck, ChevronDown, TrendingUp, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Currency } from '@/lib/types';

// ─── Mega-menu definitions ──────────────────────────────────────────────────
const SHOE_MENU = {
  label: 'Footwear',
  href: '/collection/shoes',
  subcategories: [
    { name: 'All Shoes', slug: 'shoes' },
    { name: 'Oxford Shoes', slug: 'shoes-oxford' },
    { name: 'Chelsea Boots', slug: 'shoes-chelsea' },
    { name: 'Derby Shoes', slug: 'shoes-derby' },
    { name: 'Loafers', slug: 'shoes-loafer' },
    { name: 'Monk Straps', slug: 'shoes-monk' },
    { name: 'Dress Boots', slug: 'shoes-boots' },
  ],
};

const BAG_MENU = {
  label: 'Luggage',
  href: '/collection/bags',
  subcategories: [
    { name: 'All Bags', slug: 'bags' },
    { name: 'Laptop & Briefcase', slug: 'bags-laptop' },
    { name: 'Handbags & Totes', slug: 'bags-handbag' },
    { name: 'Weekender & Duffel', slug: 'bags-weekender' },
    { name: 'Backpacks', slug: 'bags-backpack' },
    { name: 'Messenger Bags', slug: 'bags-messenger' },
  ],
};

const SIMPLE_NAV = [
  { label: 'Jackets', href: '/collection/leather-jackets' },
  { label: 'Accessories', href: '/collection/wallets-small-leather-goods' },
];

interface MegaMenuState {
  open: 'shoes' | 'bags' | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const { getCartCount, openCart, openSearch, currency, setCurrency } = useStore();

  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenu, setMegaMenu] = useState<MegaMenuState>({ open: null });
  const [mobileExpanded, setMobileExpanded] = useState<'shoes' | 'bags' | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setCartCount(getCartCount()); }, [getCartCount]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileMenuOpen(false); setMegaMenu({ open: null }); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const openMega = (which: 'shoes' | 'bags') => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaMenu({ open: which });
  };

  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaMenu({ open: null }), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#111111] text-[#E5E5E5] text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-neutral-400 font-mono text-[10px]">LONDON ATELIER</div>
          <div className="mx-auto sm:mx-0 text-center tracking-[0.2em]">Complimentary Worldwide Courier On All Allocations</div>
          <div className="hidden sm:block text-neutral-400 font-mono text-[10px]">EST. LONDON</div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 border-b border-neutral-200 ${isScrolled ? 'shadow-md py-0' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16 sm:h-20 w-full">

            {/* Col 1: Left nav */}
            <div className="flex items-center justify-start min-w-0">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#111111] hover:text-neutral-600 transition-colors p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[11px] xl:text-[12px] font-semibold tracking-[0.2em] uppercase">
                {/* Jackets — simple link */}
                <Link
                  href="/collection/leather-jackets"
                  className={`relative py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/leather-jackets') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
                >
                  Jackets
                  {pathname.startsWith('/collection/leather-jackets') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}
                </Link>

                {/* Footwear — mega-menu trigger */}
                <div
                  className="relative"
                  onMouseEnter={() => openMega('shoes')}
                  onMouseLeave={closeMega}
                >
                  <button
                    className={`flex items-center space-x-1.5 py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/shoes') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
                  >
                    <span>Footwear</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${megaMenu.open === 'shoes' ? 'rotate-180' : ''}`} />
                  </button>
                  {pathname.startsWith('/collection/shoes') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}

                  {megaMenu.open === 'shoes' && (
                    <div
                      onMouseEnter={cancelClose}
                      onMouseLeave={closeMega}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white border border-neutral-200 shadow-2xl py-4 z-50 animate-fadeIn"
                    >
                      <MegaPanel menu={SHOE_MENU} pathname={pathname} />
                    </div>
                  )}
                </div>

                {/* Luggage — mega-menu trigger */}
                <div
                  className="relative"
                  onMouseEnter={() => openMega('bags')}
                  onMouseLeave={closeMega}
                >
                  <button
                    className={`flex items-center space-x-1.5 py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/bags') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
                  >
                    <span>Luggage</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${megaMenu.open === 'bags' ? 'rotate-180' : ''}`} />
                  </button>
                  {pathname.startsWith('/collection/bags') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}

                  {megaMenu.open === 'bags' && (
                    <div
                      onMouseEnter={cancelClose}
                      onMouseLeave={closeMega}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white border border-neutral-200 shadow-2xl py-4 z-50 animate-fadeIn"
                    >
                      <MegaPanel menu={BAG_MENU} pathname={pathname} />
                    </div>
                  )}
                </div>

                {/* Accessories — simple link */}
                <Link
                  href="/collection/wallets-small-leather-goods"
                  className={`relative py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/wallets') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
                >
                  Accessories
                  {pathname.startsWith('/collection/wallets') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}
                </Link>
              </nav>
            </div>

            {/* Col 2: Logo */}
            <div className="flex items-center justify-center text-center px-2">
              <Link href="/" className="inline-block group py-1" aria-label="ACEMEN Home">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] font-light uppercase text-[#111111] group-hover:opacity-85 transition-opacity block leading-none">
                  ACEMEN
                </span>
                <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.35em] text-neutral-500 font-semibold uppercase block mt-1">
                  LONDON
                </span>
              </Link>
            </div>

            {/* Col 3: Right actions */}
            <div className="flex items-center justify-end space-x-1.5 sm:space-x-4">
              {/* Currency */}
              <div className="hidden sm:flex items-center space-x-1 text-[11px] font-medium tracking-wider text-neutral-600 mr-1">
                {(['GBP', 'USD', 'EUR'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-1.5 py-0.5 transition-colors ${currency === curr ? 'text-black font-bold border-b-2 border-black' : 'hover:text-black'}`}
                  >
                    {curr === 'GBP' ? '£' : curr === 'USD' ? '$' : '€'} {curr}
                  </button>
                ))}
              </div>

              <button onClick={openSearch} className="text-[#111111] hover:text-neutral-600 transition-colors p-2 min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label="Search">
                <Search size={19} strokeWidth={1.8} />
              </button>

              <Link href="/admin" className="hidden xl:flex items-center text-[10px] font-semibold tracking-widest uppercase text-neutral-800 hover:text-black transition-colors border border-neutral-300 px-3 py-1.5 hover:border-black rounded-none" title="Atelier CMS">
                <ShieldCheck size={13} className="mr-1.5" />
                <span>Admin</span>
              </Link>

              <button onClick={openCart} className="relative text-[#111111] hover:text-neutral-600 transition-colors p-2 min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label={`Shopping bag (${cartCount} items)`}>
                <ShoppingBag size={20} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#111111] text-white text-[9px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-[#E5E5E5] shadow-xl z-50 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            {/* Quick Links */}
            <div className="px-6 pt-5 pb-2 flex items-center space-x-3 border-b border-[#E5E5E5]">
              <Link href="/collection/top-selling" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-[#767676] hover:text-[#111111] border border-[#E5E5E5] px-2.5 py-1.5 hover:border-[#111111] transition-colors"
              >
                <TrendingUp size={11} />
                <span>Top Selling</span>
              </Link>
              <Link href="/collection/new-arrivals" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-[#767676] hover:text-[#111111] border border-[#E5E5E5] px-2.5 py-1.5 hover:border-[#111111] transition-colors"
              >
                <Sparkles size={11} />
                <span>New Arrivals</span>
              </Link>
            </div>

            <nav className="flex flex-col text-xs tracking-[0.18em] uppercase font-medium px-6 py-4 space-y-0">
              {/* Jackets */}
              <Link href="/collection/leather-jackets" className="py-3.5 border-b border-[#F0F0F0] text-[#111111] hover:text-[#767676] transition-colors min-h-[44px] flex items-center">
                Leather Jackets
              </Link>

              {/* Footwear accordion */}
              <div className="border-b border-[#F0F0F0]">
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'shoes' ? null : 'shoes')}
                  className="w-full py-3.5 text-[#111111] min-h-[44px] flex items-center justify-between"
                >
                  <span>Footwear</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 text-[#767676] ${mobileExpanded === 'shoes' ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === 'shoes' && (
                  <div className="pb-3 space-y-0 pl-3 border-t border-[#F5F5F5]">
                    {SHOE_MENU.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/collection/${sub.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2.5 text-[11px] text-[#767676] hover:text-[#111111] transition-colors min-h-[40px] flex items-center border-b border-[#F5F5F5] last:border-0"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Luggage accordion */}
              <div className="border-b border-[#F0F0F0]">
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === 'bags' ? null : 'bags')}
                  className="w-full py-3.5 text-[#111111] min-h-[44px] flex items-center justify-between"
                >
                  <span>Luggage</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 text-[#767676] ${mobileExpanded === 'bags' ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded === 'bags' && (
                  <div className="pb-3 space-y-0 pl-3 border-t border-[#F5F5F5]">
                    {BAG_MENU.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/collection/${sub.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2.5 text-[11px] text-[#767676] hover:text-[#111111] transition-colors min-h-[40px] flex items-center border-b border-[#F5F5F5] last:border-0"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/collection/wallets-small-leather-goods" className="py-3.5 border-b border-[#F0F0F0] text-[#111111] hover:text-[#767676] transition-colors min-h-[44px] flex items-center">
                Accessories
              </Link>

              <Link href="/collection/all" className="py-3.5 border-b border-[#F0F0F0] text-[#767676] hover:text-[#111111] transition-colors min-h-[44px] flex items-center text-[11px]">
                View All Collections
              </Link>

              {/* Currency */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-[11px] text-[#767676] uppercase tracking-wider font-mono">Currency</span>
                <div className="flex space-x-1">
                  {(['GBP', 'USD', 'EUR'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`text-[11px] font-mono uppercase px-2.5 py-1 min-h-[36px] transition-colors ${currency === curr ? 'bg-[#111111] text-white font-medium' : 'text-[#767676] border border-[#E5E5E5]'}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <Link href="/admin" className="pt-3 text-[11px] text-[#767676] hover:text-[#111111] flex items-center min-h-[44px]">
                <ShieldCheck size={14} className="mr-2" />
                <span>Atelier Staff CMS</span>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

// ─── Mega panel sub-component ────────────────────────────────────────────────
function MegaPanel({
  menu,
  pathname,
}: {
  menu: typeof SHOE_MENU | typeof BAG_MENU;
  pathname: string;
}) {
  return (
    <div className="px-5">
      {/* Section header */}
      <Link
        href={`/collection/${menu.subcategories[0].slug}`}
        className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#767676] border-b border-[#E5E5E5] pb-2 mb-3 hover:text-[#111111] transition-colors"
      >
        {menu.label}
      </Link>

      {/* Subcategory links */}
      <ul className="space-y-0.5 mb-4">
        {menu.subcategories.map((sub) => {
          const active = pathname === `/collection/${sub.slug}`;
          return (
            <li key={sub.slug}>
              <Link
                href={`/collection/${sub.slug}`}
                className={`block py-1.5 text-xs transition-colors ${
                  active
                    ? 'text-[#111111] font-medium'
                    : 'text-[#767676] hover:text-[#111111]'
                }`}
              >
                {sub.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Divider + merchandising quick links */}
      <div className="border-t border-[#E5E5E5] pt-3 space-y-1.5">
        <Link
          href="/collection/top-selling"
          className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#767676] hover:text-[#111111] transition-colors"
        >
          <TrendingUp size={11} />
          <span>Top Selling</span>
        </Link>
        <Link
          href="/collection/new-arrivals"
          className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-[#767676] hover:text-[#111111] transition-colors"
        >
          <Sparkles size={11} />
          <span>New Arrivals</span>
        </Link>
      </div>
    </div>
  );
}
