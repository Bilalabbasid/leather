import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryDiscovery from '@/components/luxury/CategoryDiscovery';
import MaterialsSection from '@/components/luxury/MaterialsSection';
import FootwearFeature from '@/components/luxury/FootwearFeature';
import CraftsmanshipFeature from '@/components/luxury/CraftsmanshipFeature';
import BespokeSection from '@/components/luxury/BespokeSection';
import ServicesBar from '@/components/luxury/ServicesBar';
import { prisma } from '@/lib/prisma';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { Product } from '@/lib/types';

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ displayPriority: 'desc' }, { createdAt: 'desc' }],
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: { orderBy: { displayPriority: 'asc' } },
      },
    });
    if (dbProducts.length > 0) return dbProducts as unknown as Product[];
  } catch (err) {
    console.warn('[Storefront] Database query fallback:', err);
  }
  return INITIAL_PRODUCTS;
}

export default async function HomePage() {
  const allProducts = await getProducts();

  const topSelling = allProducts.filter((p) => p.isTopSelling).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const jacketProducts = allProducts.filter(
    (p) => p.categoryId === 'cat-jackets' || p.category?.slug === 'leather-jackets'
  );
  const shoeProducts = allProducts.filter(
    (p) =>
      p.categoryId === 'cat-shoes' ||
      p.category?.slug === 'shoes' ||
      (p.categoryId || '').startsWith('cat-shoes-')
  );
  const iconProducts = allProducts.filter(
    (p) =>
      p.categoryId === 'cat-bags' ||
      p.category?.slug === 'bags' ||
      (p.categoryId || '').startsWith('cat-bags-') ||
      p.categoryId === 'cat-wallets' ||
      p.category?.slug === 'wallets-small-leather-goods' ||
      p.categoryId === 'cat-belts' ||
      p.category?.slug === 'belts-accessories'
  );

  return (
    <div className="bg-white text-[#111111] overflow-hidden">
      {/* ── 1. Cinematic Luxury Campaign Hero ────────────────────────────── */}
      <section className="relative h-[85vh] sm:h-[92vh] min-h-[580px] max-h-[920px] w-full bg-black overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/luxury/hero-campaign.webp"
            alt="ACEMEN London British Luxury Footwear & Sartorial Leather Atelier"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_25%] sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 w-full z-10">
          <div className="max-w-2xl text-white space-y-4">
            <div className="flex items-center space-x-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-mono text-[#DFC278]">
              <span className="w-6 h-[1px] bg-[#DFC278]" />
              <span>BRITISH LUXURY FOOTWEAR & LEATHER ATELIER • LONDON</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.06] text-white">
              Crafted By Hand.<br />
              <span className="italic font-normal">Sculpted For Distinction.</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed tracking-wide max-w-lg">
              Goodyear-welted British footwear, bespoke full-grain calfskin outerwear, and architectural luggage sculpted in limited London allocations.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/collection/shoes"
                className="bg-white text-[#111111] hover:bg-neutral-100 text-xs uppercase tracking-[0.2em] font-medium px-8 py-3.5 transition-colors text-center flex items-center justify-center space-x-2 min-h-[44px]"
              >
                <span>Footwear Atelier</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/collection/leather-jackets"
                className="bg-transparent hover:bg-white/10 text-white border border-white text-xs uppercase tracking-[0.2em] font-medium px-8 py-3.5 transition-colors text-center min-h-[44px] flex items-center justify-center"
              >
                <span>Leather Outerwear</span>
              </Link>
              <Link
                href="/ace"
                className="bg-transparent hover:bg-white/10 text-[#DFC278] border border-[#DFC278]/60 hover:border-[#DFC278] text-xs uppercase tracking-[0.2em] font-medium px-6 py-3.5 transition-colors text-center min-h-[44px] flex items-center justify-center"
              >
                <span>Bespoke Waitlist</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 hidden lg:flex items-center space-x-6 text-[10px] tracking-[0.25em] uppercase text-white/70 font-mono">
          <span>LONDON ATELIER</span>
          <span>51.5118° N • 0.1408° W</span>
        </div>
      </section>

      {/* ── 2. Category Discovery (6 Luxury Silhouettes) ────────────────── */}
      <CategoryDiscovery />

      {/* ── 3. Top Selling Allocations ──────────────────────────────────── */}
      {topSelling.length > 0 && (
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-[#E5E5E5] pb-4 sm:pb-5">
            <div>
              <span className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase font-mono text-[#8C5835] mb-1.5 font-semibold">
                <TrendingUp size={11} />
                <span>MOST COVETED ALLOCATIONS</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                Top Selling Pieces
              </h2>
            </div>
            <Link
              href="/collection/top-selling"
              className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#8C5835] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
            >
              <span>View All Top Selling</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {topSelling.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx === 0} />
            ))}
          </div>
        </section>
      )}

      {/* ── 4. Leather Jackets (Bespoke Outerwear) ───────────────────────── */}
      {jacketProducts.length > 0 && (
        <section className="border-t border-[#E5E5E5] py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 border-b border-[#E5E5E5] pb-4 sm:pb-5">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#8C5835] block mb-1.5 font-semibold">
                BESPOKE OUTERWEAR
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                Leather Jackets
              </h2>
            </div>
            <Link
              href="/collection/leather-jackets"
              className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#8C5835] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
            >
              <span>View All Jackets</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {jacketProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Footwear Editorial Spread ────────────────────────────────── */}
      <FootwearFeature />

      {/* ── 6. Signature Footwear (Goodyear-Welted Benchmade Pairs) ──────── */}
      {shoeProducts.length > 0 && (
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 border-b border-[#E5E5E5] pb-4 sm:pb-5">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#8C5835] block mb-1.5 font-semibold">
                GOODYEAR-WELTED BENCHMADE PAIRS
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                Signature Footwear
              </h2>
            </div>
            <Link
              href="/collection/shoes"
              className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#8C5835] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
            >
              <span>View All Footwear</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {shoeProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── 7. Editorial Craft Break ────────────────────────────────────── */}
      <section className="border-y border-[#E5E5E5] bg-neutral-50/50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#8C5835] block font-semibold">
                Artisanal Provenance
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-tight leading-[1.15] text-[#111111]">
                Uncompromised leather. Pure architectural restraint.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
                Every ACEMEN piece begins with individually hand-selected hides from premier tanneries in Tuscany and Alsace. Cut one garment at a time with millimeter precision, hand-waxed with organic beeswax, and fitted with custom palladium hardware.
              </p>
              <div className="pt-2">
                <Link
                  href="/collection/shoes"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-[#111111] border-b border-[#111111] pb-1 hover:text-[#8C5835] hover:border-[#8C5835] transition-colors min-h-[36px]"
                >
                  <span>Explore Northampton Footwear</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 max-w-lg lg:max-w-none mx-auto w-full">
              <div className="relative aspect-[3/4] max-h-[460px] bg-white border border-[#E5E5E5] overflow-hidden">
                <Image
                  src="/images/luxury/prod-jacket-classic-1.webp"
                  alt="ACEMEN tailored back construction"
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="relative aspect-[3/4] max-h-[460px] bg-white border border-[#E5E5E5] overflow-hidden">
                <Image
                  src="/images/luxury/prod-shoe-oxford-pair.webp"
                  alt="ACEMEN Goodyear-welted closed-channel sole construction"
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Heirloom Luggage & Architectural Accessories ─────────────── */}
      {iconProducts.length > 0 && (
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-[#E5E5E5] pb-4 sm:pb-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#8C5835] block mb-1.5 font-semibold">
                HEIRLOOM LUGGAGE &amp; LEATHER GOODS
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                Architectural Accessories
              </h2>
            </div>
            <Link
              href="/collection/bags"
              className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#8C5835] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
            >
              <span>View All Leather Goods</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {iconProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── 9. New Season Releases ──────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="border-t border-[#E5E5E5] py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-[#E5E5E5] pb-4 sm:pb-5">
            <div>
              <span className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase font-mono text-[#8C5835] mb-1.5 font-semibold">
                <Sparkles size={11} />
                <span>RECENT DISPATCHES</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                New Season Releases
              </h2>
            </div>
            <Link
              href="/collection/new-arrivals"
              className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#8C5835] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
            >
              <span>Explore New Arrivals</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newArrivals.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx === 0} />
            ))}
          </div>
        </section>
      )}

      {/* ── 10. Materials & Provenance ──────────────────────────────────── */}
      <MaterialsSection />

      {/* ── 11. Savoir-Faire & Craftsmanship Feature ────────────────────── */}
      <CraftsmanshipFeature />

      {/* ── 12. Made to Exact Specification (Bespoke ACE) ───────────────── */}
      <BespokeSection />

      {/* ── 13. The Art of Travel Full-Bleed Spread ─────────────────────── */}
      <section className="relative py-24 sm:py-36 bg-[#080808] text-white overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/luxury/travel-campaign.webp"
            alt="ACEMEN Jet-Set Travel Atelier"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-65 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-[#080808]/60" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
          <span className="text-[10px] font-mono font-bold tracking-[0.35em] uppercase text-[#DFC278] block">
            THE ART OF TRAVEL
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight uppercase">
            Crafted For The Endless Horizon
          </h2>
          <p className="font-sans text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
            From the London atelier to international skies, ACEMEN trunks and weekender holdalls are companion pieces engineered to outlast the journey. Available for bespoke commissions and direct allocation.
          </p>
          <div className="pt-4">
            <Link
              href="/collection/bags"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-medium text-white border-b border-white pb-1 hover:text-[#DFC278] hover:border-[#DFC278] transition-colors"
            >
              <span>EXPLORE TRUNKS & TRAVEL</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 14. Client Services & Guarantees Bar ───────────────────────── */}
      <ServicesBar />
    </div>
  );
}
