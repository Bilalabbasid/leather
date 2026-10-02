'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function WaitlistPage() {
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [categoryInterest, setCategoryInterest] = useState('Leather Jackets');
  const [preferredSize, setPreferredSize] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          productTitle: `${categoryInterest} — Bespoke Waitlist`,
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
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Manifesto */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E5E5] text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A869]">
            <Sparkles size={12} />
            <span>Private Atelier Registry</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#111111]">
            Waitlist & Private Allocation
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

        {/* Submission Form Card */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
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
                  Thank you, <span className="font-medium text-[#111111]">{name}</span>. Your allocation dossier has been lodged with the London atelier. When your piece is ready, our master artisan will reach you directly at <span className="font-mono text-[#111111]">{phone}</span> and deliver to your registered residence.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 border border-[#E5E5E5] text-left text-xs font-mono space-y-1">
                <div className="text-[10px] text-[#767676] uppercase">Registered Delivery Destination:</div>
                <div className="text-[#111111]">{addressLine1}, {city} {postcode}, {country}</div>
              </div>

              <div className="pt-4">
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

                {/* Category & Size Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                      Atelier Category
                    </label>
                    <select
                      value={categoryInterest}
                      onChange={(e) => setCategoryInterest(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs text-[#111111] bg-white focus:outline-none focus:border-[#111111]"
                    >
                      <option value="Leather Jackets">Leather Jackets (Outerwear)</option>
                      <option value="Goodyear Welted Shoes">Goodyear-Welted Footwear</option>
                      <option value="Luggage & Travel Bags">Luggage & Holdalls</option>
                      <option value="Small Leather Goods">Wallets & Accessories</option>
                      <option value="Complete Bespoke Commission">Complete Bespoke Commission</option>
                    </select>
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
                      <span>Submit Allocation Application</span>
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
