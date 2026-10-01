import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
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

// Category tile definitions — uses real product images
const CATEGORY_TILES = [
  { name: 'Leather Jackets', slug: 'leather-jackets', image: '/images/products/biker_jacket_front.jpg', label: 'Jackets' },
  { name: 'Oxford Shoes', slug: 'shoes-oxford', image: '/images/products/oxford_pair_front.jpg', label: 'Oxford' },
  { name: 'Chelsea Boots', slug: 'shoes-chelsea', image: '/images/products/chelsea_pair_front.jpg', label: 'Chelsea' },
  { name: 'Laptop & Briefcase', slug: 'bags-laptop', image: '/images/products/leather_briefcase.jpg', label: 'Briefcase' },
  { name: 'Handbags & Totes', slug: 'bags-handbag', image: '/images/products/leather_handbag.jpg', label: 'Handbags' },
  { name: 'Wallets & SLG', slug: 'wallets-small-leather-goods', image: '/images/products/wallet_front.jpg', label: 'Accessories' },
];

export default async function HomePage() {
  const allProducts = await getProducts();

  const jacketProducts = allProducts.filter(
    (p) => p.categoryId === 'cat-jackets' || p.category?.slug === 'leather-jackets'
  );
  const shoeProducts = allProducts.filter(
    (p) => p.categoryId === 'cat-shoes' || p.category?.slug === 'shoes' ||
           (p.categoryId || '').startsWith('cat-shoes-')
  );
  const topSelling = allProducts.filter((p) => p.isTopSelling).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const iconProducts = allProducts.filter(
    (p) =>
      p.categoryId === 'cat-bags' || p.category?.slug === 'bags' ||
      (p.categoryId || '').startsWith('cat-bags-') ||
      p.categoryId === 'cat-wallets' || p.category?.slug === 'wallets-small-leather-goods' ||
      p.categoryId === 'cat-belts' || p.category?.slug === 'belts-accessories'
  );

  return (
    <div className="bg-white text-[#111111] overflow-hidden">

      {/* ── 1. Cinematic Editorial Hero ────────────────────────────────── */}
      <section className="relative h-[72vh] sm:h-[82vh] min-h-[520px] max-h-[840px] w-full bg-black overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/editorial_hero.jpg"
            alt="ACEMEN London Atelier Editorial Campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[78%_top] sm:object-top"
          />
          {/* Subtle directional gradient so text is readable while image stays crisp & sharp */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 w-full z-10">
          <div className="max-w-xl text-white space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.28em] font-mono text-neutral-300">
              <span className="w-5 h-[1px] bg-white/70" />
              <span>AUTUMN / WINTER ALLOCATIONS</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.05] text-white">
              Permanent Form.<br />
              <span className="italic font-normal">Disciplined Craft.</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed tracking-wide max-w-md pt-0.5">
              Bespoke full-grain calfskin jackets, Goodyear-welted footwear, and architectural luggage sculpted in limited London allocations.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                href="/collection/leather-jackets"
                className="bg-white text-[#111111] hover:bg-neutral-100 text-xs uppercase tracking-[0.2em] font-medium px-7 py-3.5 transition-colors text-center flex items-center justify-center space-x-2 min-h-[44px]"
              >
                <span>Leather Jackets</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/collection/shoes"
                className="bg-transparent hover:bg-white/10 text-white border border-white text-xs uppercase tracking-[0.2em] font-medium px-7 py-3.5 transition-colors text-center min-h-[44px] flex items-center justify-center"
              >
                <span>Signature Footwear</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 hidden lg:flex items-center space-x-6 text-[10px] tracking-[0.25em] uppercase text-white/70 font-mono">
          <span>LONDON ATELIER</span>
          <span>51.5118° N • 0.1408° W</span>
        </div>
      </section>

      {/* ── 2. Top Selling ──────────────────────────────────────────────── */}
      {topSelling.length > 0 && (
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 border-b border-[#E5E5E5] pb-4 sm:pb-5">
            <div>
              <span className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] mb-1.5">
                <TrendingUp size={11} />
                <span>Client Favourites</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                Top Selling
              </h2>
            </div>
            <Link
              href="/collection/top-selling"
              className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#767676] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
            >
              <span>View All</span>
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

      {/* ── 3. Editorial Craft Break ────────────────────────────────────── */}
      <section className="border-y border-[#E5E5E5] bg-neutral-50/50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] block">
                Artisanal Provenance
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-tight leading-[1.15] text-[#111111]">
                Uncompromised leather. Pure architectural restraint.
              </h2>
              <p className="text-xs sm:text-sm text-[#767676] font-sans leading-relaxed">
                Every ACEMEN piece begins with individually hand-selected hides from premier tanneries in Tuscany and Catalonia. Cut one garment at a time with millimeter precision, hand-waxed with organic beeswax, and fitted with custom palladium hardware.
              </p>
              <div className="pt-2">
                <Link
                  href="/collection/shoes"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-[#111111] border-b border-[#111111] pb-1 hover:text-[#767676] hover:border-[#767676] transition-colors min-h-[36px]"
                >
                  <span>Explore Northampton Footwear</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 max-w-lg lg:max-w-none mx-auto w-full">
              <div className="relative aspect-[3/4] max-h-[460px] bg-white border border-[#E5E5E5] overflow-hidden">
                <Image
                  src="/images/products/biker_jacket_back.jpg"
                  alt="ACEMEN tailored back construction"
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="relative aspect-[3/4] max-h-[460px] bg-white border border-[#E5E5E5] overflow-hidden">
                <Image
                  src="/images/products/oxford_pair_top.jpg"
                  alt="ACEMEN Goodyear welted footwear matching pair"
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Signature Allocations (Permanent Collection) ─────────────── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-[#E5E5E5] pb-4 sm:pb-6">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] block mb-1.5">
              Atelier Permanent Collection
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
              Signature Allocations
            </h2>
          </div>
          <Link
            href="/collection/all"
            className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#767676] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
          >
            <span>Explore All Pieces</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[...jacketProducts.slice(0, 2), ...shoeProducts.slice(0, 2)].map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx === 0} />
          ))}
        </div>
      </section>

      {/* ── 5. New Arrivals ──────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="border-t border-[#E5E5E5] py-14 sm:py-20 bg-neutral-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 border-b border-[#E5E5E5] pb-4 sm:pb-5">
              <div>
                <span className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] mb-1.5">
                  <Sparkles size={11} />
                  <span>Just Arrived</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/collection/new-arrivals"
                className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#767676] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
              >
                <span>View All New</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {newArrivals.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5.5 Top Selling & Iconic Allocations ─────────────────────────── */}
      {topSelling.length > 0 && (
        <section className="border-t border-[#E5E5E5] py-14 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 border-b border-[#E5E5E5] pb-4 sm:pb-5">
              <div>
                <span className="flex items-center space-x-2 text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] mb-1.5">
                  <TrendingUp size={11} />
                  <span>Most Coveted Allocations</span>
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                  Top Selling Pieces
                </h2>
              </div>
              <Link
                href="/collection/top-selling"
                className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#767676] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
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
          </div>
        </section>
      )}

      {/* ── 6. Shop by Category Tile Grid ───────────────────────────────── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 border-b border-[#E5E5E5] pb-4 sm:pb-5">
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] block mb-1.5">
            Browse the Atelier
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.slug}
              href={`/collection/${tile.slug}`}
              className="group relative aspect-[4/5] bg-neutral-100 border border-[#E5E5E5] overflow-hidden block"
            >
              <Image
                src={tile.image}
                alt={tile.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/70 mb-0.5">
                  ACEMEN
                </p>
                <p className="font-serif text-sm sm:text-base font-light text-white uppercase tracking-wide">
                  {tile.label}
                </p>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowRight size={14} className="text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 7. Accessories ───────────────────────────────────────────────── */}
      <section className="border-t border-[#E5E5E5] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-[#E5E5E5] pb-4 sm:pb-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] block mb-1.5">
                Heirloom Luggage &amp; Leather Goods
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-[#111111]">
                Architectural Accessories
              </h2>
            </div>
            <Link
              href="/collection/bags"
              className="mt-3 sm:mt-0 text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-[#767676] transition-colors flex items-center space-x-1.5 font-medium group min-h-[36px]"
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
        </div>
      </section>
    </div>
  );
}
