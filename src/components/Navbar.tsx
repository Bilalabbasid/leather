'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, ChevronDown, TrendingUp, Sparkles } from 'lucide-react';
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
  { label: 'Waitlist', href: '/waitlist' },
];

interface MegaMenuState {
  open: 'shoes' | 'bags' | 'more' | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const { getCartCount, openCart, openSearch, currency, setCurrency } = useStore();

  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenu, setMegaMenu] = useState<MegaMenuState>({ open: null });
  const [mobileExpanded, setMobileExpanded] = useState<'shoes' | 'bags' | 'more' | null>(null);
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
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
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) {
          const knownSlugs = [
            'leather-jackets',
            'shoes',
            'bags',
            'wallets-small-leather-goods',
            'shoes-oxford',
            'shoes-chelsea',
            'shoes-derby',
            'shoes-loafer',
            'shoes-monk',
            'shoes-boots',
            'bags-laptop',
            'bags-handbag',
            'bags-weekender',
            'bags-backpack',
            'bags-messenger',
          ];
          const custom = data.categories.filter(
            (c: any) => c.isActive && !knownSlugs.includes(c.slug)
          );
          setDbCategories(custom);
        }
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Completely hide storefront Navbar on admin routes to prevent double-header
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const openMega = (which: 'shoes' | 'bags' | 'more') => {
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
          <div className="flex items-center justify-between h-16 sm:h-20 w-full gap-4">

            {/* Left: Mobile Hamburger & Official Brand Lockup */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-[#111111] hover:text-neutral-600 transition-colors p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group py-1" aria-label="ACEMEN Home">
                <img
                  src="/images/logo.png"
                  alt="ACEMEN"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col text-left">
                  <span className="font-serif text-lg sm:text-2xl tracking-[0.26em] font-medium uppercase text-[#111111] group-hover:opacity-85 transition-opacity block leading-none">
                    ACEMEN
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-sans tracking-[0.32em] text-[#8C5835] font-semibold uppercase block mt-1 leading-none">
                    LONDON • ATELIER
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-[11px] xl:text-[12px] font-semibold tracking-[0.15em] uppercase whitespace-nowrap">
              {/* Jackets */}
              <Link
                href="/collection/leather-jackets"
                className={`relative py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/leather-jackets') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
              >
                Jackets
                {pathname.startsWith('/collection/leather-jackets') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}
              </Link>

              {/* Footwear */}
              <div
                className="relative"
                onMouseEnter={() => openMega('shoes')}
                onMouseLeave={closeMega}
              >
                <button
                  className={`flex items-center space-x-1 py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/shoes') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
                >
                  <span>Footwear</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${megaMenu.open === 'shoes' ? 'rotate-180' : ''}`} />
                </button>
                {pathname.startsWith('/collection/shoes') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}

                {megaMenu.open === 'shoes' && (
                  <div
                    onMouseEnter={cancelClose}
                    onMouseLeave={closeMega}
                    className="absolute top-full left-0 mt-2 w-72 bg-white border border-neutral-200 shadow-2xl py-4 z-50 animate-fadeIn"
                  >
                    <MegaPanel menu={SHOE_MENU} pathname={pathname} />
                  </div>
                )}
              </div>

              {/* Luggage */}
              <div
                className="relative"
                onMouseEnter={() => openMega('bags')}
                onMouseLeave={closeMega}
              >
                <button
                  className={`flex items-center space-x-1 py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/bags') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
                >
                  <span>Luggage</span>
                  <ChevronDown size={11} className={`transition-transform duration-200 ${megaMenu.open === 'bags' ? 'rotate-180' : ''}`} />
                </button>
                {pathname.startsWith('/collection/bags') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}

                {megaMenu.open === 'bags' && (
                  <div
                    onMouseEnter={cancelClose}
                    onMouseLeave={closeMega}
                    className="absolute top-full left-0 mt-2 w-72 bg-white border border-neutral-200 shadow-2xl py-4 z-50 animate-fadeIn"
                  >
                    <MegaPanel menu={BAG_MENU} pathname={pathname} />
                  </div>
                )}
              </div>

              {/* Accessories */}
              <Link
                href="/collection/wallets-small-leather-goods"
                className={`relative py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith('/collection/wallets') ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
              >
                Accessories
                {pathname.startsWith('/collection/wallets') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}
              </Link>

              {/* Dynamically added custom categories */}
              {dbCategories.slice(0, 1).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/collection/${cat.slug}`}
                  className={`relative py-1 whitespace-nowrap transition-colors duration-150 ${pathname.startsWith(`/collection/${cat.slug}`) ? 'text-[#111111]' : 'text-neutral-700 hover:text-black'}`}
                >
                  {cat.name}
                  {pathname.startsWith(`/collection/${cat.slug}`) && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]" />}
                </Link>
              ))}

              {/* Overflow dropdown if multiple custom categories exist */}
              {dbCategories.length > 1 && (
                <div
                  className="relative"
                  onMouseEnter={() => openMega('more')}
                  onMouseLeave={closeMega}
                >
                  <button
                    className="flex items-center space-x-1 py-1 whitespace-nowrap text-neutral-700 hover:text-black transition-colors"
                  >
                    <span>More</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${megaMenu.open === 'more' ? 'rotate-180' : ''}`} />
                  </button>
                  {megaMenu.open === 'more' && (
                    <div
                      onMouseEnter={cancelClose}
                      onMouseLeave={closeMega}
                      className="absolute top-full left-0 mt-2 w-52 bg-white border border-neutral-200 shadow-2xl py-2 z-50 animate-fadeIn"
                    >
                      {dbCategories.slice(1).map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/collection/${cat.slug}`}
                          className="block px-4 py-2 text-xs font-mono tracking-wider uppercase text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ACE — Bespoke */}
              <Link
                href="/ace"
                className={`relative py-1 whitespace-nowrap transition-colors duration-150 tracking-[0.2em] font-bold ${pathname === '/ace' ? 'text-[#8B5A2B]' : 'text-[#8B5A2B] hover:text-black'}`}
                title="ACE — Bespoke Atelier"
              >
                ACE
                {pathname === '/ace' && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#8B5A2B]" />}
              </Link>
            </nav>

            {/* Right: Currency + Search + Cart */}
            <div className="flex items-center justify-end space-x-1.5 sm:space-x-4 shrink-0 z-20">
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

              {/* Dynamic Categories in Mobile Menu */}
              {dbCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/collection/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3.5 border-b border-[#F0F0F0] text-[#111111] hover:text-[#767676] transition-colors min-h-[44px] flex items-center"
                >
                  {cat.name}
                </Link>
              ))}

              {/* ACE Bespoke */}
              <Link
                href="/ace"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 border-b border-[#F0F0F0] text-[#8B5A2B] font-bold flex items-center justify-between min-h-[44px]"
              >
                <span className="tracking-[0.25em]">ACE</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Made on Demand</span>
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
