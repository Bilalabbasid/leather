'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Clock, CheckCircle2, MessageSquare, PhoneCall, Mail } from 'lucide-react';

interface BespokePiece {
  id: string;
  title: string;
  category: string;
  badge: string;
  image: string;
  craftNotes: string;
  specs: string[];
}

const ACE_PIECES: BespokePiece[] = [
  {
    id: 'ace-jacket',
    title: 'The Sovereign Bespoke Aviator',
    category: 'Bespoke Apparel • One of One',
    badge: 'Custom Commission',
    image: '/images/ace/ace_bespoke_jacket.jpg',
    craftNotes: 'Individually patterned to your millimeter anatomy. Cut from choice French box calfskin with hand-burnished beeswax edges, solid palladium dual zippers, and custom monogrammed silk twill interior.',
    specs: ['Bespoke Pattern Drafted per Client', '60+ Hours Single-Artisan Bench Craft', 'Choice of 8 Premier European Tanneries', 'Personal Initial Hot-Stamping'],
  },
  {
    id: 'ace-weekender',
    title: 'The Diplomatic Grand Weekender',
    category: 'Bespoke Luggage • Made on Demand',
    badge: 'Private Allocation',
    image: '/images/products/duffel_angle.jpg',
    craftNotes: 'Sculpted from 2.2mm full-grain Tuscan bullhide, oil-waxed for lifetime durability. Fitted with bespoke hand-engraved solid brass hardware and reinforced saddle-stitched stress points.',
    specs: ['Hand-Waxed French Linen Stitching', 'Custom Dimensions & Compartment Layout', 'Solid Palladium or Brass Keyed Padlock', 'Complimentary Leather Luggage Tag'],
  },
  {
    id: 'ace-briefcase',
    title: 'The Executive Hard Attaché',
    category: 'Architectural Leather Case • Bespoke Order',
    badge: 'Single Allocation',
    image: '/images/products/leather_briefcase.jpg',
    craftNotes: 'Hand-formed hardwood core wrapped in burnished English bridle leather. Features dual Swiss precision combination locks and an alcantara-lined interior bespoke-molded to your hardware.',
    specs: ['Solid Hardwood Internal Structural Core', 'Tailored Electronics & Document Compartment', 'Hand-Stitched Ergonomic Handle', 'Museum-Grade Saddle Finish'],
  },
  {
    id: 'ace-footwear',
    title: 'The Westminster Lasted Boot',
    category: 'Handcrafted Footwear • Private Last',
    badge: 'Bespoke Lasting',
    image: '/images/products/chelsea_pair_front.jpg',
    craftNotes: 'Sculpted over personal carved beechwood lasts sculpted exclusively for the curves of your feet. Finished with hand-sewn Goodyear welts, bevelled fiddleback waists, and oak bark tanned soles.',
    specs: ['Individual Hand-Carved Wooden Foot Last', 'French Florentine Full-Grain Calfskin', 'Hand-Sewn Welted Sole Construction', 'Lifetime Resoling & Care Protocol'],
  },
];

export default function AceBespokePage() {
  const [selectedPiece, setSelectedPiece] = useState<string>('The Sovereign Bespoke Aviator');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [consultationType, setConsultationType] = useState('WhatsApp Direct Concierge');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleSelectAndScroll = (pieceTitle: string) => {
    setSelectedPiece(pieceTitle);
    const formElement = document.getElementById('consultation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen">
      {/* ── 1. Hero Header ────────────────────────────────────────── */}
      <section className="relative border-b border-neutral-800 bg-gradient-to-b from-[#141414] via-[#0D0D0D] to-[#0A0A0A] py-16 sm:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C19A6B]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-3 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#C19A6B] mb-3">
            <span className="w-6 h-[1px] bg-[#C19A6B]" />
            <span className="font-bold">ACE • PRIVATE ATELIER ALLOCATION</span>
            <span className="w-6 h-[1px] bg-[#C19A6B]" />
          </div>

          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.05] text-white mb-6">
              ACE <span className="text-[#C19A6B] italic font-normal">Bespoke</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed tracking-wide mb-6">
              Nothing in the <span className="text-white font-semibold">ACE</span> atelier is produced in advance. Every single piece is sculpted strictly on demand for clients who speak with our master artisan, custom-built to your exact dimensions, leather provenance, and hardware specifications.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-widest text-neutral-400">
              <span className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                <Sparkles size={12} className="text-[#C19A6B]" />
                <span>Zero Mass Production</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                <Clock size={12} className="text-[#C19A6B]" />
                <span>Made Strictly On Demand</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5">
                <ShieldCheck size={12} className="text-[#C19A6B]" />
                <span>One-of-One Ownership</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The 4 Bespoke Commissions Showcase ────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-neutral-800 pb-5">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#C19A6B] block mb-1">
              Atelier Portfolio
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-wide uppercase text-white">
              Bespoke Reference Commissions
            </h2>
          </div>
          <p className="mt-2 sm:mt-0 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            No Fixed Price • Quoted per Client Specification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {ACE_PIECES.map((piece) => (
            <div
              key={piece.id}
              className="bg-[#121212] border border-neutral-800 hover:border-[#C19A6B]/50 transition-all duration-300 flex flex-col group"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-neutral-700 text-[#C19A6B] text-[9px] font-mono uppercase tracking-[0.2em] px-3 py-1">
                  {piece.badge}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-neutral-700 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1">
                  Made on Demand
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block mb-1.5">
                    {piece.category}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-wide mb-3">
                    {piece.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-6">
                    {piece.craftNotes}
                  </p>

                  <div className="space-y-2 border-t border-neutral-800/80 pt-4 mb-6">
                    {piece.specs.map((spec, i) => (
                      <div key={i} className="flex items-center space-x-2 text-[11px] text-neutral-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C19A6B]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Pricing</span>
                    <span className="text-xs font-mono text-[#C19A6B] uppercase tracking-wider font-semibold">
                      Private Quote Upon Consultation
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelectAndScroll(piece.title)}
                    className="bg-white text-black hover:bg-[#C19A6B] hover:text-black text-[11px] font-semibold tracking-[0.18em] uppercase px-5 py-3 transition-colors flex items-center space-x-2"
                  >
                    <span>Commission This Piece</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. The 4-Step Bespoke Protocol ───────────────────────── */}
      <section className="border-y border-neutral-800 bg-[#111111] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C19A6B] block mb-2">
              The Artisan Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light uppercase text-white tracking-wide">
              How an ACE Piece is Born
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border border-neutral-800 bg-[#0E0E0E] p-6 sm:p-7 relative">
              <span className="text-2xl font-serif text-[#C19A6B] font-light block mb-3">01</span>
              <h4 className="font-serif text-lg text-white mb-2 uppercase tracking-wide">Consultation &amp; Anatomy</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                You speak directly with our team to define silhouette, ergonomics, measurements, and functional preferences.
              </p>
            </div>

            <div className="border border-neutral-800 bg-[#0E0E0E] p-6 sm:p-7 relative">
              <span className="text-2xl font-serif text-[#C19A6B] font-light block mb-3">02</span>
              <h4 className="font-serif text-lg text-white mb-2 uppercase tracking-wide">Hide &amp; Hardware Selection</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Select your individual hide from French box calfskin, Tuscan bullhide, or Spanish shearling, alongside palladium or brass hardware.
              </p>
            </div>

            <div className="border border-neutral-800 bg-[#0E0E0E] p-6 sm:p-7 relative">
              <span className="text-2xl font-serif text-[#C19A6B] font-light block mb-3">03</span>
              <h4 className="font-serif text-lg text-white mb-2 uppercase tracking-wide">Bench Construction</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                A single dedicated master leather craftsman spends 40 to 70 hours hand-cutting, saddle-stitching, and edge-burnishing your piece.
              </p>
            </div>

            <div className="border border-neutral-800 bg-[#0E0E0E] p-6 sm:p-7 relative">
              <span className="text-2xl font-serif text-[#C19A6B] font-light block mb-3">04</span>
              <h4 className="font-serif text-lg text-white mb-2 uppercase tracking-wide">White-Glove Handover</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Delivered in a handcrafted wooden storage case with a signed certificate of unique provenance and permanent leather registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Bespoke Consultation & Commission Form ─────────────── */}
      <section id="consultation-form" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] border border-neutral-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C19A6B]/5 rounded-full blur-2xl pointer-events-none" />

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C19A6B]/10 text-[#C19A6B] border border-[#C19A6B]/30 mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-serif text-3xl font-light text-white tracking-wide">
                Bespoke Inquiry Received
              </h3>
              <p className="text-neutral-300 font-sans text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{fullName}</span>. Our master atelier concierge has received your bespoke brief for <span className="text-[#C19A6B]">{selectedPiece}</span> and will reach out via <span className="text-white">{consultationType}</span> within 12 hours.
              </p>
              
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/447700900077?text=Hello%20ACEMEN%20Atelier,%20I%20am%20interested%20in%20commissioning%20an%20ACE%20Bespoke%20piece:%20${encodeURIComponent(selectedPiece)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-black font-semibold text-xs uppercase tracking-widest px-6 py-3 flex items-center space-x-2 hover:bg-[#20ba59] transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Open Direct WhatsApp Concierge</span>
                </a>
                <Link
                  href="/"
                  className="border border-neutral-700 text-white text-xs uppercase tracking-widest px-6 py-3 hover:border-white transition-colors"
                >
                  Return to Storefront
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 border-b border-neutral-800 pb-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C19A6B] block mb-1">
                  Private Allocation
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light uppercase text-white tracking-wide">
                  Commission an ACE Bespoke Piece
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
                  Fill in your preferred specifications below, or leave them open to discuss with our master craftsman.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                    Item of Interest / Commission Type *
                  </label>
                  <select
                    value={selectedPiece}
                    onChange={(e) => setSelectedPiece(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-neutral-700 text-white text-xs px-4 py-3 focus:outline-none focus:border-[#C19A6B] transition-colors"
                  >
                    <option value="The Sovereign Bespoke Aviator">The Sovereign Bespoke Aviator (Jacket)</option>
                    <option value="The Diplomatic Grand Weekender">The Diplomatic Grand Weekender (Luggage)</option>
                    <option value="The Executive Hard Attaché">The Executive Hard Attaché (Briefcase)</option>
                    <option value="The Westminster Lasted Boot">The Westminster Lasted Boot (Footwear)</option>
                    <option value="Completely Custom Bespoke Concept">Completely Custom Bespoke Concept (New Design)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lord Alexander Wright"
                      className="w-full bg-[#1A1A1A] border border-neutral-700 text-white text-xs px-4 py-3 focus:outline-none focus:border-[#C19A6B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@residence.com"
                      className="w-full bg-[#1A1A1A] border border-neutral-700 text-white text-xs px-4 py-3 focus:outline-none focus:border-[#C19A6B] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      WhatsApp / Phone (For Rapid Atelier Consultation)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7700 900000"
                      className="w-full bg-[#1A1A1A] border border-neutral-700 text-white text-xs px-4 py-3 focus:outline-none focus:border-[#C19A6B] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Preferred Consultation Format
                    </label>
                    <select
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-neutral-700 text-white text-xs px-4 py-3 focus:outline-none focus:border-[#C19A6B] transition-colors"
                    >
                      <option value="WhatsApp Direct Concierge">WhatsApp Direct Concierge</option>
                      <option value="Private Video Call with Atelier">Private Video Call with Atelier</option>
                      <option value="Email Private Discussion">Email Private Discussion</option>
                      <option value="London Mayfair Atelier Appointment">London Mayfair Atelier Appointment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                    Bespoke Specifications, Dimensions &amp; Special Requests
                  </label>
                  <textarea
                    rows={4}
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    placeholder="Describe your sizing, leather preference (e.g. French box calf, Spanish shearling), hardware tone (Palladium, Brass, Champagne Gold), initials for monogramming, or bespoke features you desire..."
                    className="w-full bg-[#1A1A1A] border border-neutral-700 text-white text-xs p-4 focus:outline-none focus:border-[#C19A6B] transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck size={12} className="text-[#C19A6B]" />
                    <span>Strict Confidentiality • No Obligation Until Spec is Approved</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#C19A6B] hover:bg-[#d5ac7d] text-black font-semibold text-xs uppercase tracking-[0.2em] px-8 py-4 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Transmitting to Atelier...' : 'Submit Bespoke Brief'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Atelier Contact Footer ─────────────────────────────── */}
      <section className="border-t border-neutral-800 py-12 text-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
        <p className="mb-2">ACEMEN ACE ATELIER • LONDON MAYFAIR</p>
        <p>DIRECT CONCIERGE: <a href="mailto:concierge@acemen.uk" className="text-[#C19A6B] underline hover:text-white">CONCIERGE@ACEMEN.UK</a></p>
      </section>
    </div>
  );
}
