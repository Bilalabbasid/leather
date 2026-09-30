'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { useStore } from '@/lib/store';
import {
  Ruler,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Check,
  ZoomIn,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface PDPProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: PDPProps) {
  const { slug } = params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const {
    formatPricePence,
    addToCart,
    openSizeGuide,
  } = useStore();

  // Variant & State
  const activeVariants = (product.variants || []).filter((v) => v.isActive);
  const [selectedVariant, setSelectedVariant] = useState(
    activeVariants[0] || product.variants[0]
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [openSection, setOpenSection] = useState<'craft' | 'care' | 'delivery' | null>('craft');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToBagRef = useRef<HTMLButtonElement>(null);

  // Show sticky bar when main add-to-bag button scrolls out of view
  useEffect(() => {
    const el = addToBagRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleSection = (section: 'craft' | 'care' | 'delivery') => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAdd = () => {
    if (!selectedVariant || selectedVariant.stockQuantity <= 0) return;
    addToCart(product, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  // Related products from same category or priority
  const relatedProducts = INITIAL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.categoryId === product.categoryId || p.isTopSelling)
  ).slice(0, 2);

  const images = product.images || [];
  const primaryImage = images[activeImageIndex] || images[0];

  // Currency price calculation
  const currentPriceInPence =
    selectedVariant?.priceOverrideInPence ?? product.priceInPence;

  // JSON-LD structured data for luxury product SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: images.map((img) => img.url),
    description: product.description,
    sku: product.styleCode,
    brand: {
      '@type': 'Brand',
      name: 'ACEMEN',
    },
    offers: {
      '@type': 'Offer',
      url: `https://acemen.uk/products/${product.slug}`,
      priceCurrency: 'GBP',
      price: (currentPriceInPence / 100).toFixed(2),
      availability:
        selectedVariant?.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Bar */}
      <div className="border-b border-[#E5E5E5] py-3.5 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex items-center text-[10px] uppercase tracking-[0.2em] font-mono text-[#767676]">
          <Link href="/" className="hover:text-[#111111]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/collection/${product.categoryId.replace('cat-', '')}`}
            className="hover:text-[#111111]"
          >
            {product.category?.name || 'Collections'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#111111] truncate">{product.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Editorial Gallery (Desktop Vertical Stack + Mobile Interactive Switcher) */}
          <div className="lg:col-span-6 flex flex-col space-y-4 max-w-lg lg:max-w-none mx-auto w-full">
            {/* Main Featured Photo View with accessible Zoom toggle */}
            <div
              className={`relative aspect-[3/4] max-h-[540px] w-full bg-neutral-50 border border-[#E5E5E5] overflow-hidden ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsZoomed(!isZoomed);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Toggle high-resolution image zoom"
            >
              {primaryImage && (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText || `${product.title} by ACEMEN`}
                  fill
                  priority
                  className={`object-cover object-center transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              )}

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2 pointer-events-none">
                {product.isFeaturedHero && (
                  <span className="bg-[#111111] text-white text-[9px] uppercase tracking-[0.25em] font-mono px-2.5 py-1">
                    Atelier Hero Piece
                  </span>
                )}
                {product.isTopSelling && (
                  <span className="bg-white text-[#111111] text-[9px] uppercase tracking-[0.25em] font-mono px-2.5 py-1 border border-[#E5E5E5]">
                    Iconic Allocation
                  </span>
                )}
              </div>

              {/* Zoom Instruction Cue */}
              <div className="absolute bottom-4 right-4 bg-white/90 border border-[#E5E5E5] px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-[#767676] flex items-center space-x-1">
                <ZoomIn size={11} />
                <span>{isZoomed ? 'Click to Reset' : 'Zoom'}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative aspect-[3/4] border transition-all overflow-hidden bg-neutral-50 ${
                      activeImageIndex === idx
                        ? 'border-[#111111] ring-1 ring-[#111111]'
                        : 'border-[#E5E5E5] opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.title} angle ${idx + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Vertical Secondary Angle (Editorial Walkthrough) */}
            {images.length > 1 && (
              <div className="hidden lg:block pt-8 border-t border-[#E5E5E5] space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] block">
                    Tailoring Perspective
                  </span>
                  <p className="text-xs text-[#767676] leading-relaxed">
                    Sculpted to preserve structural integrity over decades. Every seam is reinforced with double-needle saddle stitching and hand-creased perimeter edges.
                  </p>
                </div>
                <div className="relative aspect-[3/4] w-full bg-neutral-50 border border-[#E5E5E5] overflow-hidden">
                  <Image
                    src={images[1].url}
                    alt={images[1].altText || `${product.title} perspective`}
                    fill
                    className="object-cover object-center"
                    sizes="60vw"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Purchase & Specifications Panel */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Style Code & Category */}
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] border-b border-[#E5E5E5] pb-3">
                <span>SKU: {product.styleCode}</span>
                <span>{product.category?.name}</span>
              </div>

              {/* Title & Pricing */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111] leading-tight mb-2">
                  {product.title}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline space-x-3">
                  <span className="font-mono text-2xl sm:text-3xl font-normal text-[#111111]">
                    {formatPricePence(currentPriceInPence)}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#767676] font-mono">
                    UK VAT Included • Direct Atelier Allocation
                  </span>
                </div>
              </div>

              {/* Material & Leather Grade Summary */}
              <div className="py-3 px-4 bg-neutral-50 border border-[#E5E5E5] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#767676]">Primary Material:</span>
                  <span className="font-medium text-[#111111]">{product.material}</span>
                </div>
                {product.leatherGrade && (
                  <div className="flex justify-between">
                    <span className="text-[#767676]">Tannery Grade:</span>
                    <span className="font-medium text-[#111111]">{product.leatherGrade}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#767676]">Color Family:</span>
                  <span className="font-medium text-[#111111]">{product.colorFamily}</span>
                </div>
              </div>

              {/* Short Editorial Description */}
              <p className="text-xs text-[#767676] font-sans leading-relaxed tracking-wide">
                {product.description}
              </p>

              {/* Variant / Size Selection */}
              <div className="space-y-4 pt-2 border-t border-[#E5E5E5]">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase tracking-widest font-mono text-[10px] text-[#767676]">
                    Select Size & Allocation
                  </span>
                  <button
                    onClick={() => openSizeGuide(product.categoryId)}
                    className="text-[10px] uppercase tracking-wider text-[#111111] hover:text-[#767676] flex items-center space-x-1 underline min-h-[36px]"
                  >
                    <Ruler size={11} />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const isOutOfStock = v.stockQuantity <= 0;

                    return (
                      <button
                        key={v.id}
                        disabled={!v.isActive || isOutOfStock}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 text-left border text-xs transition-colors flex flex-col justify-between min-h-[50px] ${
                          isSelected
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : isOutOfStock
                            ? 'border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed'
                            : 'border-[#E5E5E5] text-[#111111] hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-medium">{v.size}</span>
                          {isSelected && <Check size={12} />}
                        </div>
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider mt-1 ${
                            isSelected ? 'text-neutral-300' : 'text-[#767676]'
                          }`}
                        >
                          {isOutOfStock
                            ? 'Allocation Exhausted'
                            : `${v.stockQuantity} in atelier`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Add to Shopping Bag Action */}
                <button
                  ref={addToBagRef}
                  onClick={handleAdd}
                  disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
                  className="w-full min-h-[50px] py-4 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-2 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
                >
                  {selectedVariant?.stockQuantity <= 0 ? (
                    <span>Allocation Currently Exhausted</span>
                  ) : addedAnimation ? (
                    <>
                      <Check size={14} />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Accordions: Craft Notes, Care, Delivery */}
              <div className="border-t border-[#E5E5E5] divide-y divide-[#E5E5E5] pt-2">
                {/* Craftsmanship Notes */}
                {product.craftNotes && (
                  <div>
                    <button
                      onClick={() => toggleSection('craft')}
                      className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#111111]"
                    >
                      <span>Artisanal Construction & Provenance</span>
                      {openSection === 'craft' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openSection === 'craft' && (
                      <div className="pb-4 text-xs text-[#767676] font-sans leading-relaxed">
                        {product.craftNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* Care Details */}
                {product.careDetails && (
                  <div>
                    <button
                      onClick={() => toggleSection('care')}
                      className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#111111]"
                    >
                      <span>Preservation & Care</span>
                      {openSection === 'care' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openSection === 'care' && (
                      <div className="pb-4 text-xs text-[#767676] font-sans leading-relaxed">
                        {product.careDetails}
                      </div>
                    )}
                  </div>
                )}

                {/* Courier & Guarantee */}
                <div>
                  <button
                    onClick={() => toggleSection('delivery')}
                    className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#111111]"
                  >
                    <span>Delivery & Atelier Warranty</span>
                    {openSection === 'delivery' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {openSection === 'delivery' && (
                    <div className="pb-4 text-xs text-[#767676] font-sans leading-relaxed space-y-2">
                      <p>
                        Each piece is inspected by our master artisan, packed in protective breathable cloth garment bags, and dispatched with insured express courier tracking.
                      </p>
                      <p>
                        Backed by ACEMEN lifetime structural stitching warranty.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#E5E5E5]">
            <div className="mb-10 text-center">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#767676] block mb-1">
                Atelier Complement
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-wide">
                Related Creations
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add-to-Bag Bar */}
      <div
        className={`lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#E5E5E5] transition-transform duration-300 safe-area-inset-bottom ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-light text-[#111111] truncate">{product.title}</p>
            <p className="text-[10px] font-mono text-[#767676] uppercase tracking-widest truncate">
              {selectedVariant?.size || 'Select size'}
              {selectedVariant && ` · ${formatPricePence(selectedVariant.priceOverrideInPence ?? product.priceInPence)}`}
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
            className="flex-shrink-0 min-h-[44px] px-5 py-2.5 bg-[#111111] hover:bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center space-x-2 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {addedAnimation ? (
              <>
                <Check size={12} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
