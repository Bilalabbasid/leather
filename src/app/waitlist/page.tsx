'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Mail,
  User,
  ArrowRight,
  Loader2,
  ChevronRight,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';

export default function WaitlistPage() {
  const { showToast } = useStore();

  const [waitlistProducts, setWaitlistProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [preferredSize, setPreferredSize] = useState('');
  const [notes, setNotes] = useState('');
  const [customInterest, setCustomInterest] = useState('Waitlist');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch waitlist products from DB
  useEffect(() => {
    async function loadWaitlistProducts() {
      try {
        const res = await fetch('/api/products?category=waitlist');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.products)) {
            setWaitlistProducts(data.products);
          }
        }
      } catch (e) {
        console.error('Failed to load waitlist products', e);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadWaitlistProducts();
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setError(null);
    const formElement = document.getElementById('waitlist-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const fullDeliveryAddress = [
      addressLine1.trim(),
      city.trim(),
      postcode.trim(),
      country.trim(),
    ]
      .filter(Boolean)
      .join(', ');

    if (!fullDeliveryAddress || fullDeliveryAddress.length < 5) {
      setError('Please provide a full delivery address including city, postal code, and country.');
      setIsSubmitting(false);
      return;
    }

    const chosenTitle = selectedProduct
      ? selectedProduct.title
      : `${customInterest} — Bespoke Waitlist`;

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          deliveryAddress: fullDeliveryAddress,
          category: 'Waitlist',
          productTitle: chosenTitle,
          productId: selectedProduct?.id || null,
          preferredSize: preferredSize.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        showToast('Your allocation request has been registered.');
      } else {
        setError(data.error || 'Failed to submit registration.');
      }
    } catch {
      setError('Network communication interrupted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-[#111111]">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Manifesto */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E5E5] text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A869]">
            <Sparkles size={12} />
            <span>Private Atelier Registry</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#111111]">
            Waitlist &amp; Private Allocation
          </h1>
          <p className="text-xs sm:text-sm text-[#767676] leading-relaxed">
            Due to our uncompromising standard of hand-cutting single hides and Goodyear welt construction, our annual workshop capacity is strictly capped. Join our private registry to reserve upcoming production slots and bespoke commissions.
          </p>
        </div>

        {/* Benefits Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-[#E5E5E5] text-left space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-[#C5A869] flex items-center justify-center text-xs font-mono">
              01
            </div>
            <h3 className="font-medium text-xs uppercase tracking-wider text-[#111111]">
              First Tannery Access
            </h3>
            <p className="text-[11px] text-[#767676] leading-relaxed">
              Priority selection of rare vegetable-tanned French calfskins and Spanish Merino shearling.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E5E5E5] text-left space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-[#C5A869] flex items-center justify-center text-xs font-mono">
              02
            </div>
            <h3 className="font-medium text-xs uppercase tracking-wider text-[#111111]">
              Direct Concierge Fitting
            </h3>
            <p className="text-[11px] text-[#767676] leading-relaxed">
              Personal consultation with our master patternmaker for bespoke measurements and adjustments.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#E5E5E5] text-left space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-[#C5A869] flex items-center justify-center text-xs font-mono">
              03
            </div>
            <h3 className="font-medium text-xs uppercase tracking-wider text-[#111111]">
              White-Glove Delivery
            </h3>
            <p className="text-[11px] text-[#767676] leading-relaxed">
              Insured priority courier carriage with serial provenance documentation and dust garment protection.
            </p>
          </div>
        </div>

        {/* Showcase of Waitlist Category Products */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E5E5] pb-4 gap-3">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A869] mb-1">
                Atelier Gallery
              </div>
              <h2 className="font-serif text-2xl uppercase tracking-wide text-[#111111]">
                Pieces Available for Waitlist Allocation
              </h2>
            </div>
            <div className="text-xs font-mono text-[#767676]">
              {loadingProducts ? 'Cataloging pieces...' : `${waitlistProducts.length} Piece${waitlistProducts.length === 1 ? '' : 's'} Allocated`}
            </div>
          </div>

          {loadingProducts ? (
            <div className="p-12 text-center text-xs font-mono text-[#767676] flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Retrieving atelier allocations...</span>
            </div>
          ) : waitlistProducts.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] p-8 text-center space-y-3">
              <p className="font-serif text-sm uppercase text-[#111111]">
                General Bespoke Allocation Open
              </p>
              <p className="text-xs text-[#767676] max-w-md mx-auto">
                No specific single-edition pieces are currently spotlighted, but individual commissions remain open below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {waitlistProducts.map((product) => {
                const primaryImage =
                  product.images?.find((img) => img.isPrimary)?.url ||
                  product.images?.[0]?.url ||
                  '/placeholder-leather.jpg';
                const isSelected = selectedProduct?.id === product.id;

                return (
                  <div
                    key={product.id}
                    className={`bg-white border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#111111] shadow-md ring-1 ring-[#111111]'
                        : 'border-[#E5E5E5] hover:border-neutral-400'
                    }`}
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group">
                        <Image
                          src={primaryImage}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-[#111111]/90 text-white text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 flex items-center gap-1.5 backdrop-blur-sm">
                          <Clock size={10} className="text-[#C5A869]" />
                          <span>Waitlist Only</span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-[#C5A869] text-black text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-1 flex items-center gap-1">
                            <Check size={11} />
                            <span>Selected</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#767676]">
                          <span>{product.styleCode || 'ATELIER-BESPOKE'}</span>
                          <span className="text-[#111111] font-semibold">
                            £{(product.priceInPence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <h3 className="font-serif text-lg font-light uppercase tracking-wide text-[#111111] line-clamp-1">
                          {product.title}
                        </h3>

                        {product.material && (
                          <div className="text-[11px] text-[#C5A869] font-mono uppercase tracking-wider">
                            {product.material}
                          </div>
                        )}

                        <p className="text-xs text-[#767676] line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-5 pt-0 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className={`w-full py-2.5 text-xs uppercase tracking-[0.2em] font-mono transition-colors flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-[#111111] text-[#C5A869]'
                            : 'bg-white border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check size={13} />
                            <span>Piece Selected</span>
                          </>
                        ) : (
                          <span>Reserve This Piece</span>
                        )}
                      </button>

                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full text-center block text-[10px] font-mono uppercase tracking-widest text-[#767676] hover:text-[#111111] py-1 transition-colors"
                      >
                        View Full Atelier Dossier →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submission Form Card */}
        <div id="waitlist-form" className="bg-white border border-[#E5E5E5] p-6 sm:p-10 shadow-sm max-w-2xl mx-auto scroll-mt-24">
          {isSuccess ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-[#111111] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-[#C5A869]" strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A869] block">
                  Confidential Dossier Created
                </span>
                <h2 className="font-serif text-3xl uppercase tracking-wide text-[#111111]">
                  You Are Registered
                </h2>
                <p className="text-xs text-[#767676] max-w-md mx-auto">
                  Thank you, <span className="font-medium text-[#111111]">{name}</span>. Your allocation dossier has been lodged with the London atelier for{' '}
                  <span className="font-semibold text-[#111111]">
                    {selectedProduct ? selectedProduct.title : customInterest}
                  </span>
                  . When your piece is ready, our master artisan will reach you directly at{' '}
                  <span className="font-mono text-[#111111]">{phone}</span> and deliver to your registered residence.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 border border-[#E5E5E5] text-left text-xs font-mono space-y-1">
                <div className="text-[10px] text-[#767676] uppercase">Registered Delivery Destination:</div>
                <div className="text-[#111111]">{addressLine1}, {city} {postcode}, {country}</div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-3 border border-[#111111] text-xs uppercase tracking-[0.2em] font-mono hover:bg-neutral-50"
                >
                  Register Another Allocation
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-mono hover:bg-black transition-colors"
                >
                  <span>Explore Existing Collection</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-[#E5E5E5] pb-4">
                <h2 className="font-serif text-2xl uppercase tracking-wide text-[#111111]">
                  Atelier Waitlist Application
                </h2>
                <p className="text-xs text-[#767676] mt-1">
                  Please provide your contact details and confirmed delivery address. All information is managed under strict confidentiality.
                </p>
              </div>

              {/* Selected Piece Notification Banner */}
              {selectedProduct ? (
                <div className="p-3.5 bg-[#FAF9F5] border border-[#C5A869]/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 relative bg-neutral-200 border border-[#E5E5E5] flex-shrink-0 overflow-hidden">
                      <Image
                        src={selectedProduct.images?.[0]?.url || '/placeholder-leather.jpg'}
                        alt={selectedProduct.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-mono tracking-widest text-[#C5A869]">
                        Selected Allocation Piece
                      </div>
                      <div className="text-xs font-serif uppercase tracking-wide text-[#111111]">
                        {selectedProduct.title}
                      </div>
                      <div className="text-[10px] font-mono text-[#767676]">
                        £{(selectedProduct.priceInPence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-[#767676] hover:text-[#111111] p-1.5 transition-colors"
                    title="Clear selection"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : null}

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Full Name */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alistair Vance"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    <User size={14} className="text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full pl-9 pr-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                      <Mail size={14} className="text-neutral-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                      Telephone / Mobile <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7700 900123"
                        className="w-full pl-9 pr-3 py-2.5 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                      <Phone size={14} className="text-neutral-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#767676]">
                    <MapPin size={12} className="text-[#C5A869]" />
                    <span>Delivery Residence / Address <span className="text-rose-500">*</span></span>
                  </div>

                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Street address / residence line"
                    className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City / Town"
                      className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    <input
                      type="text"
                      required
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="Postal Code"
                      className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country (e.g. United Kingdom)"
                    className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                {/* Selected Piece or Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                      Piece / Allocation Scope
                    </label>
                    {selectedProduct ? (
                      <div className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] bg-neutral-50 truncate flex items-center justify-between">
                        <span className="truncate">{selectedProduct.title}</span>
                        <button
                          type="button"
                          onClick={handleClearSelection}
                          className="text-[10px] text-neutral-500 hover:text-black font-mono underline ml-2 flex-shrink-0"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <select
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] bg-white focus:outline-none focus:border-[#111111]"
                      >
                        {waitlistProducts.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title} (£{(p.priceInPence / 100).toFixed(0)})
                          </option>
                        ))}
                        <option value="Leather Jackets">Leather Jackets (Outerwear)</option>
                        <option value="Goodyear Welted Shoes">Goodyear-Welted Footwear</option>
                        <option value="Luggage & Travel Bags">Luggage &amp; Holdalls</option>
                        <option value="Small Leather Goods">Wallets &amp; Accessories</option>
                        <option value="Complete Bespoke Commission">Complete Bespoke Commission</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                      Preferred Sizing (Optional)
                    </label>
                    <input
                      type="text"
                      value={preferredSize}
                      onChange={(e) => setPreferredSize(e.target.value)}
                      placeholder="e.g. 40R, UK 9.5, Custom"
                      className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Atelier Customization Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific leather preferences, bespoke sizing considerations, or target timeline..."
                    className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                {/* Submit */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-mono transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Registering Allocation...</span>
                      </>
                    ) : (
                      <span>
                        {selectedProduct
                          ? `Reserve Allocation for ${selectedProduct.title}`
                          : 'Submit Allocation Application'}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#767676] pt-1">
                  <ShieldCheck size={13} className="text-[#C5A869]" />
                  <span>Strictly confidential London Atelier client protocol.</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
