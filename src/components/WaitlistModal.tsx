'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Phone, MapPin, Mail, User, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
  productId?: string;
  category?: string;
  initialSize?: string;
}

export default function WaitlistModal({
  isOpen,
  onClose,
  productTitle,
  productId,
  category = 'Waitlist',
  initialSize = '',
}: WaitlistModalProps) {
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [preferredSize, setPreferredSize] = useState(initialSize);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Combine delivery address fields
    const fullDeliveryAddress = [
      addressLine1.trim(),
      city.trim(),
      postcode.trim(),
      country.trim(),
    ]
      .filter(Boolean)
      .join(', ');

    if (!fullDeliveryAddress || fullDeliveryAddress.length < 5) {
      setError('Please provide a complete delivery address with postal code and city.');
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
          category,
          productTitle: productTitle || 'Private Vault Allocation',
          productId: productId || null,
          preferredSize: preferredSize.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        showToast('Your atelier allocation request has been registered.');
      } else {
        setError(data.error || 'Failed to submit waitlist registration.');
      }
    } catch {
      setError('Connection interrupted. Please verify your internet network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleResetAndClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-[#E5E5E5] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-[#111111] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-14 h-14 bg-[#111111] text-white flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-[#C5A869]" strokeWidth={1.5} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A869] block">
                Allocation Registered • London Atelier
              </span>
              <h3 className="font-serif text-2xl uppercase tracking-wide text-[#111111]">
                Waitlist Request Confirmed
              </h3>
              <p className="text-xs text-[#767676] max-w-sm mx-auto">
                Thank you, <span className="font-medium text-[#111111]">{name}</span>. Your details have been entered into our private London registry. Our atelier concierge will contact you at <span className="font-mono text-[#111111]">{phone}</span> once the piece is ready for white-glove dispatch.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 border border-[#E5E5E5] text-left text-xs space-y-1 font-mono">
              <div className="text-[10px] text-[#767676] uppercase">Registered Delivery Destination:</div>
              <div className="text-[#111111]">{addressLine1}, {city} {postcode}, {country}</div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-mono transition-colors"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A869] mb-1">
                <Sparkles size={12} />
                <span>Private Allocation Registry</span>
              </div>
              <h3 className="font-serif text-2xl font-light text-[#111111] uppercase tracking-wide">
                Join Atelier Waitlist
              </h3>
              <p className="text-xs text-[#767676] mt-1">
                {productTitle ? (
                  <>
                    Request priority allocation for{' '}
                    <span className="text-[#111111] font-medium">{productTitle}</span>.
                  </>
                ) : (
                  'Reserve pre-order allocations, bespoke creations, and private tannery releases.'
                )}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Full Name */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Alistair Vance"
                    className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <User size={13} className="text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Email & Phone Row */}
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
                      className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    <Mail size={13} className="text-neutral-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7700 900123"
                      className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                    />
                    <Phone size={13} className="text-neutral-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Delivery Address Fields */}
              <div className="space-y-2 pt-1 border-t border-[#E5E5E5]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#767676]">
                  <MapPin size={12} className="text-[#C5A869]" />
                  <span>Delivery Address <span className="text-rose-500">*</span></span>
                </div>

                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Street address / residence / apartment"
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City / Town"
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Postal Code"
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country (e.g. United Kingdom, USA)"
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Size & Preferred Product */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Preferred Size / Fit
                  </label>
                  <input
                    type="text"
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(e.target.value)}
                    placeholder="e.g. 40R, UK 9, Bespoke"
                    className="w-full px-3 py-2 border border-[#E5E5E5] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                    Category / Piece
                  </label>
                  <input
                    type="text"
                    value={productTitle || category}
                    readOnly
                    className="w-full px-3 py-2 bg-neutral-100 border border-[#E5E5E5] text-xs text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bespoke Notes */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#767676] block mb-1">
                  Atelier Notes / Customization Wishes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special sizing, preferred leather hide (e.g. French Box Calf, Spanish Shearling), or timeline..."
                  className="w-full px-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-mono transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Registering Allocation...</span>
                    </>
                  ) : (
                    <span>Register for Waitlist Allocation</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#767676] pt-1">
                <ShieldCheck size={12} className="text-[#C5A869]" />
                <span>Strictly confidential London Atelier client protocol.</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
