'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Variant } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, formatPricePence } = useStore();

  const activeVariants = (product.variants || []).filter((v) => v.isActive);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    activeVariants[0] || (product.variants && product.variants[0])
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.images || [];
  const primaryImg = images.find((i) => i.isPrimary) || images[0];
  const secondaryImg = images.length > 1 ? images[1] : primaryImg;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariant || selectedVariant.stockQuantity <= 0) return;

    addToCart(product, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  // Badge logic — NEW takes priority over BESTSELLER
  let badgeLabel: string | null = null;
  let badgeStyle = 'bg-[#111111] text-white';
  if (product.isNewArrival) {
    badgeLabel = 'NEW';
    badgeStyle = 'bg-[#8B6914] text-[#FFF8E7]'; // warm amber for new
  } else if (product.isTopSelling) {
    badgeLabel = 'BESTSELLER';
    badgeStyle = 'bg-[#111111] text-white';
  }

  const pricePence = selectedVariant?.priceOverrideInPence ?? product.priceInPence;

  return (
    <div
      className="group relative flex flex-col h-full bg-white max-w-[340px] w-full mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with strict 3:4 aspect ratio */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block w-full aspect-[3/4] overflow-hidden bg-neutral-50 border border-[#E5E5E5]"
        aria-label={`View ${product.title}`}
      >
        {/* Primary Image */}
        {primaryImg && (
          <Image
            src={primaryImg.url}
            alt={primaryImg.altText || `${product.title} by ACEMEN`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover object-center transition-all duration-300 ${
              isHovered && secondaryImg && secondaryImg.url !== primaryImg.url
                ? 'opacity-0'
                : 'opacity-100 group-hover:scale-[1.03]'
            }`}
          />
        )}

        {/* Secondary Hover Image on Pointer Devices */}
        {secondaryImg && secondaryImg.url !== primaryImg?.url && (
          <Image
            src={secondaryImg.url}
            alt={secondaryImg.altText || `${product.title} secondary angle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-opacity duration-300 absolute inset-0 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Badge */}
        {badgeLabel && (
          <div className={`absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] uppercase tracking-[0.22em] font-mono px-2 py-0.5 ${badgeStyle}`}>
            {badgeLabel}
          </div>
        )}

        {/* Desktop Quick Actions Overlay (Appears on Hover without layout shift) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-white/98 border-t border-[#E5E5E5] translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden md:block">
          <div className="space-y-2">
            {/* Quick Size Select */}
            {activeVariants.length > 1 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-wider text-[#767676] px-0.5">
                  <span>Size:</span>
                  <span className="font-medium text-[#111111] truncate max-w-[190px]">
                    {selectedVariant?.size}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-1 overflow-x-auto py-0.5 scrollbar-none">
                  {activeVariants.map((v) => {
                    // Extract clean pill label
                    let pillLabel = v.size.split('/')[0].trim();
                    if (v.size.includes('XXL')) pillLabel = 'XXL';
                    else if (v.size.includes('Extra Large') || v.size.includes('XL')) pillLabel = 'XL';
                    else if (v.size.includes('Large')) pillLabel = 'L';
                    else if (v.size.includes('Medium')) pillLabel = 'M';
                    else if (v.size.includes('Small')) pillLabel = 'S';
                    else {
                      const uk = v.size.match(/UK\s*(\d+)/i);
                      if (uk) pillLabel = `UK ${uk[1]}`;
                    }

                    return (
                      <button
                        key={v.id}
                        title={v.size}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedVariant(v);
                        }}
                        className={`text-[9px] px-2 py-0.5 border font-mono transition-colors whitespace-nowrap ${
                          selectedVariant?.id === v.id
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#E5E5E5] text-[#767676] hover:border-neutral-400 bg-white'
                        }`}
                      >
                        {pillLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={handleQuickAdd}
              disabled={selectedVariant?.stockQuantity === 0}
              className="w-full py-2.5 bg-[#111111] text-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors flex items-center justify-center space-x-1.5 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
            >
              {selectedVariant?.stockQuantity === 0 ? (
                <span>Out of Stock</span>
              ) : addedAnimation ? (
                <>
                  <Check size={12} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus size={12} />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-2.5 sm:pt-3 pb-1 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <Link href={`/products/${product.slug}`} className="flex-1 min-w-0">
              <h3 className="font-serif text-sm sm:text-base tracking-wide text-[#111111] hover:text-[#767676] transition-colors font-normal line-clamp-1">
                {product.title}
              </h3>
            </Link>

            <span className="font-mono text-xs sm:text-sm text-[#111111] tracking-wider flex-shrink-0 ml-1">
              {formatPricePence(pricePence)}
            </span>
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#767676] tracking-wide line-clamp-1 mb-2">
            {product.leatherGrade || product.material}
          </p>
        </div>

        {/* Mobile Action Button (44px touch target) */}
        <div className="md:hidden pt-1">
          <button
            onClick={handleQuickAdd}
            disabled={selectedVariant?.stockQuantity === 0}
            className="w-full min-h-[44px] py-2 border border-[#111111] text-[#111111] text-[10px] uppercase tracking-[0.16em] font-medium active:bg-[#111111] active:text-white transition-colors disabled:opacity-40 flex items-center justify-center space-x-1"
          >
            {selectedVariant?.stockQuantity === 0 ? (
              <span>Out of Stock</span>
            ) : addedAnimation ? (
              <>
                <Check size={12} />
                <span>Added to Bag</span>
              </>
            ) : (
              <span>Add to Bag</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
