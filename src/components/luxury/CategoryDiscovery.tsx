'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    name: 'Footwear Atelier',
    count: 'Oxfords, Monks & Boots',
    image: '/images/luxury/prod-shoe-oxford-pair.webp',
    href: '/collection/shoes',
  },
  {
    name: 'Sartorial Belts',
    count: 'English Bridle Belts',
    image: '/images/luxury/prod-belt-1.webp',
    href: '/collection/belts-accessories',
  },
  {
    name: 'Leather Jackets',
    count: 'Classic & Aviators',
    image: '/images/luxury/prod-jacket-classic-1.webp',
    href: '/collection/leather-jackets',
  },
  {
    name: 'Holdalls & Bags',
    count: 'Weekenders & Totes',
    image: '/images/luxury/prod-weekender-1.webp',
    href: '/collection/bags',
  },
  {
    name: 'Wallets & SLG',
    count: 'Bifolds & Cardholders',
    image: '/images/luxury/prod-cardholder-1.webp',
    href: '/collection/wallets-small-leather-goods',
  },
  {
    name: 'Trunks & Travel',
    count: 'Duffels & Luggage',
    image: '/images/luxury/travel-campaign.webp',
    href: '/collection/bags-weekender',
  },
];

export default function CategoryDiscovery() {
  return (
    <section className="py-16 sm:py-24 bg-[#FCFBF8] border-y border-[#E5E5E5]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#8C5835] block mb-2 font-semibold">
              DISCOVER BY SILHOUETTE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-light tracking-wide uppercase">
              Explore ACEMEN
            </h2>
          </div>
          <Link
            href="/collection/all"
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#111111] border-b border-[#111111] pb-1 hover:text-[#8C5835] hover:border-[#8C5835] transition-colors self-start sm:self-auto min-h-[32px] inline-flex items-center"
          >
            VIEW ALL ALLOCATIONS
          </Link>
        </div>

        {/* 6-Column Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group block text-center space-y-3"
            >
              {/* Image Container with Consistent Aspect Ratio */}
              <div className="relative aspect-[4/5] bg-white overflow-hidden border border-[#E5E5E5] transition-all duration-300 group-hover:border-[#111111] group-hover:shadow-md">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Typography */}
              <div className="pt-1">
                <h3 className="font-serif text-base sm:text-lg font-normal text-[#111111] group-hover:text-[#8C5835] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[9px] font-sans tracking-[0.2em] text-[#767676] uppercase block mt-0.5">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
