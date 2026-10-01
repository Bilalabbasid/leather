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

// Shoe size parser and formatter
function parseShoeSize(rawSize: string) {
  const ukMatch = rawSize.match(/UK\s*(\d+(\.\d+)?)/i);
  const usMatch = rawSize.match(/US\s*(\d+(\.\d+)?)/i);
  const euMatch = rawSize.match(/EU\s*(\d+(\.\d+)?)/i);

  const uk = ukMatch ? ukMatch[1] : '';
  const us = usMatch ? usMatch[1] : (uk ? String(Number(uk) + 1) : '');
  const eu = euMatch ? euMatch[1] : (uk ? String(Number(uk) + 34) : '');

  return { uk, us, eu };
}

function getShoeDisplay(rawSize: string, scale: 'UK' | 'US' | 'EU') {
  const { uk, us, eu } = parseShoeSize(rawSize);
  if (!uk && !us && !eu) {
    return { primary: rawSize, secondary: '', all: rawSize };
  }

  if (scale === 'UK') {
    return {
      primary: `UK ${uk}`,
      secondary: `US ${us} · EU ${eu}`,
      all: `UK ${uk} (US ${us} / EU ${eu})`,
    };
  } else if (scale === 'US') {
    return {
      primary: `US ${us}`,
      secondary: `UK ${uk} · EU ${eu}`,
      all: `US ${us} (UK ${uk} / EU ${eu})`,
    };
  } else {
    return {
      primary: `EU ${eu}`,
      secondary: `UK ${uk} · US ${us}`,
      all: `EU ${eu} (UK ${uk} / US ${us})`,
    };
  }
}

// Jacket size parser and formatter
function parseJacketSize(rawSize: string) {
  if (rawSize.includes('Small')) {
    return { letter: 'Small', chest: '38R', fit: 'Fits 36"–38" chest' };
  } else if (rawSize.includes('Medium')) {
    return { letter: 'Medium', chest: '40R', fit: 'Fits 39"–41" chest' };
  } else if (rawSize.includes('Large') && !rawSize.includes('Extra')) {
    return { letter: 'Large', chest: '42R', fit: 'Fits 42"–44" chest' };
  } else if (rawSize.includes('Extra Large') || rawSize.includes('XL')) {
    return { letter: 'Extra Large (XL)', chest: '44R', fit: 'Fits 45"–47" chest' };
  } else if (rawSize.includes('XXL')) {
    return { letter: 'XXL', chest: '46R', fit: 'Fits 48"–50" chest' };
  }

  const chestMatch = rawSize.match(/(\d+R)/i);
  const chest = chestMatch ? chestMatch[1] : rawSize;
  const letter = rawSize.split('/')[1]?.trim() || rawSize;
  return { letter, chest, fit: 'Tailored Regular Cut' };
}

function getJacketDisplay(rawSize: string, scale: 'letter' | 'chest') {
  const { letter, chest, fit } = parseJacketSize(rawSize);

  if (scale === 'letter') {
    return {
      primary: letter,
      secondary: `Chest ${chest} · ${fit}`,
      summary: `${letter} — Chest ${chest} (${fit})`,
    };
  } else {
    return {
      primary: `Chest ${chest}`,
      secondary: `${letter} · ${fit}`,
      summary: `Chest ${chest} — ${letter} (${fit})`,
    };
  }
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

  // Category & Product Type Flags
  const isFootwear =
    product.categoryId.includes('shoes') ||
    product.slug.includes('shoe') ||
    product.slug.includes('boot') ||
    product.slug.includes('loafer') ||
    product.slug.includes('derby') ||
    product.slug.includes('oxford') ||
    product.variants.some((v) => v.size.includes('UK'));

  const isJacket =
    product.categoryId.includes('jackets') ||
    product.slug.includes('jacket') ||
    product.slug.includes('shearling') ||
    product.slug.includes('biker') ||
    product.variants.some((v) => v.size.includes('R') || v.size.includes('Small') || v.size.includes('Large'));

  // Sizing standard toggles
  const [shoeScale, setShoeScale] = useState<'UK' | 'US' | 'EU'>('UK');
  const [jacketScale, setJacketScale] = useState<'letter' | 'chest'>('letter');

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
              <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
                {/* Header row: SIZE + Scale selector (for shoes) + Size Guide */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-sans text-xs uppercase tracking-widest font-semibold text-[#111111]">
                      SIZE
                    </span>

                    {/* Shoe Scale Switcher: UK / US / EU */}
                    {isFootwear && (
                      <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono border-l border-[#E5E5E5] pl-3">
                        <span className="text-[#888888] text-[10px] uppercase">Scale:</span>
                        {(['UK', 'US', 'EU'] as const).map((scale) => (
                          <button
                            key={scale}
                            type="button"
                            onClick={() => setShoeScale(scale)}
                            className={`px-1.5 py-0.5 transition-colors text-[10px] tracking-wider uppercase font-semibold ${
                              shoeScale === scale
                                ? 'text-[#111111] underline underline-offset-4 decoration-2'
                                : 'text-[#888888] hover:text-[#111111]'
                            }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openSizeGuide(product.categoryId)}
                    className="text-[10px] uppercase tracking-wider text-[#767676] hover:text-[#111111] flex items-center space-x-1 underline min-h-[32px]"
                  >
                    <Ruler size={11} />
                    <span>Size Guide</span>
                  </button>
                </div>

                {/* Horizontal Rounded Pills (Matching exact reference design) */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const isOutOfStock = v.stockQuantity <= 0;

                    let pillText = v.size;

                    if (isJacket) {
                      if (v.size.includes('Small')) pillText = 'SMALL';
                      else if (v.size.includes('Medium')) pillText = 'MEDIUM';
                      else if (v.size.includes('Extra Large') || v.size.includes('XL')) pillText = 'XL';
                      else if (v.size.includes('XXL')) pillText = 'XXL';
                      else if (v.size.includes('Large')) pillText = 'LARGE';
                    } else if (isFootwear) {
                      const { uk, us, eu } = parseShoeSize(v.size);
                      if (shoeScale === 'UK') pillText = `UK ${uk}`;
                      else if (shoeScale === 'US') pillText = `US ${us}`;
                      else if (shoeScale === 'EU') pillText = `EU ${eu}`;
                    }

                    return (
                      <button
                        key={v.id}
                        disabled={!v.isActive || isOutOfStock}
                        onClick={() => setSelectedVariant(v)}
                        className={`min-w-[76px] sm:min-w-[88px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs uppercase tracking-wider font-sans transition-all text-center border ${
                          isSelected
                            ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                            : isOutOfStock
                            ? 'bg-neutral-50 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                            : 'bg-white text-[#111111] border-neutral-300 hover:border-black'
                        }`}
                      >
                        {pillText}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Sizing Specification Hint */}
                {selectedVariant && (
                  <p className="text-[11px] font-mono text-[#767676] pt-0.5">
                    {isFootwear ? (
                      <>
                        Selected: <span className="text-[#111111] font-medium">{getShoeDisplay(selectedVariant.size, 'UK').all}</span> · Standard F-Width British Fitting
                      </>
                    ) : isJacket ? (
                      <>
                        Selected: <span className="text-[#111111] font-medium">{getJacketDisplay(selectedVariant.size, 'letter').summary}</span>
                      </>
                    ) : (
                      <>
                        Selected: <span className="text-[#111111] font-medium">{selectedVariant.size}</span>
                      </>
                    )}
                  </p>
                )}

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
              {selectedVariant
                ? isFootwear
                  ? `Size: ${getShoeDisplay(selectedVariant.size, shoeScale).primary} (${getShoeDisplay(selectedVariant.size, shoeScale).secondary})`
                  : isJacket
                  ? `Size: ${getJacketDisplay(selectedVariant.size, jacketScale).primary}`
                  : `Size: ${selectedVariant.size}`
                : 'Select size'}
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
