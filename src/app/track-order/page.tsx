'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  AlertCircle,
  Loader2,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { formatPence } from '@/lib/config';

interface TrackedOrder {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  totalInPence: number;
  createdAt: string;
  shippingCity?: string | null;
  shippingCountry?: string | null;
  orderItems: Array<{
    id: string;
    title: string;
    sku: string;
    size: string;
    color: string;
    quantity: number;
    unitPriceInPence: number;
    lineTotalInPence: number;
    imageUrl?: string | null;
  }>;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (ref: string, clientEmail?: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const url = new URL('/api/orders/track', window.location.origin);
      url.searchParams.set('orderNumber', ref.trim());
      if (clientEmail?.trim()) {
        url.searchParams.set('email', clientEmail.trim());
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No matching order found for this reference.');
        setOrder(null);
      }
    } catch {
      setError('Unable to query atelier delivery network. Please verify connection.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber, email);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'DISPATCHED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'PROCESSING':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'PAID':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-300';
    }
  };

  const deliverySteps = [
    {
      title: 'Allocation Verified',
      desc: 'Order received and payment settled',
      done: order?.status !== 'PENDING',
      active: order?.status === 'PAID',
    },
    {
      title: 'Atelier Inspection & Finishing',
      desc: 'Master inspection and conditioning',
      done: order?.status === 'PROCESSING' || order?.status === 'DISPATCHED' || order?.status === 'DELIVERED',
      active: order?.status === 'PROCESSING',
    },
    {
      title: 'White-Glove Dispatch',
      desc: 'In transit via secure express carriage',
      done: order?.status === 'DISPATCHED' || order?.status === 'DELIVERED',
      active: order?.status === 'DISPATCHED',
    },
    {
      title: 'Delivered',
      desc: 'Handover complete with recipient signature',
      done: order?.status === 'DELIVERED',
      active: order?.status === 'DELIVERED',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A869] block font-semibold">
          Client Services & Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#111111] uppercase tracking-tight">
          Track Your Atelier Order
        </h1>
        <p className="text-xs text-[#767676] max-w-md mx-auto">
          Enter your order reference identifier below to inspect allocation status, atelier dispatch, and courier carriage.
        </p>
      </div>

      {/* Query Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E5E5] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#767676] block mb-1">
            Order Reference
          </label>
          <div className="relative">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ACM-2026-123456"
              required
              className="w-full pl-9 pr-3 py-2.5 border border-[#E5E5E5] text-xs font-mono text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111]"
            />
            <Search size={14} className="text-neutral-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="flex-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-[#767676] block mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@domain.com"
            className="w-full px-3 py-2.5 border border-[#E5E5E5] text-xs font-sans text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="sm:self-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#111111] hover:bg-black text-white text-xs uppercase font-mono tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            <span>Inspect</span>
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {order && (
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#767676] block">
                Atelier Allocation
              </span>
              <h2 className="text-xl font-serif text-[#111111] uppercase tracking-wide">
                {order.orderNumber}
              </h2>
              <span className="text-[11px] text-[#767676] font-mono">
                Allocated: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
              <span className={`text-[10px] uppercase font-mono px-3 py-1 border ${getStatusBadge(order.status)}`}>
                Delivery Status: {order.status}
              </span>
              <span className="text-sm font-mono font-medium text-[#111111]">
                Total: {formatPence(order.totalInPence)}
              </span>
            </div>
          </div>

          {/* Delivery Timeline Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#767676]">
                Delivery Journey
              </span>
              {order.shippingCity && (
                <span className="text-[11px] font-mono text-[#111111] flex items-center gap-1">
                  <MapPin size={12} className="text-[#C5A869]" />
                  Destination: {order.shippingCity}, {order.shippingCountry}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {deliverySteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 border text-xs transition-colors ${
                    step.done
                      ? 'border-emerald-500/40 bg-emerald-50/50'
                      : step.active
                      ? 'border-[#111111] bg-white ring-1 ring-[#111111]'
                      : 'border-[#E5E5E5] bg-neutral-50/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-semibold text-[#111111] mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center text-[9px]">
                      {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-[10px] text-[#767676] leading-tight">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Items in order */}
          <div className="border border-[#E5E5E5] divide-y divide-[#E5E5E5]">
            <div className="p-3 bg-neutral-50 text-[10px] uppercase font-mono tracking-wider text-[#767676]">
              Pieces in Allocation
            </div>
            {order.orderItems.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-medium text-[#111111]">{item.title}</h4>
                  <div className="text-[11px] text-[#767676] space-x-2 font-mono mt-0.5">
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>Color: {item.color}</span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="font-mono text-[#111111] font-medium">
                  {formatPence(item.lineTotalInPence)}
                </div>
              </div>
            ))}
          </div>

          {/* Concierge Assistance */}
          <div className="pt-2 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#767676]">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-[#111111]" />
              <span>Complimentary insured carriage with London Atelier signature validation.</span>
            </div>
            <a
              href="mailto:concierge@acemen.co.uk?subject=Order%20Enquiry%20"
              className="text-[#111111] font-medium underline underline-offset-4 hover:text-[#C5A869] transition-colors"
            >
              Contact Atelier Concierge
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="bg-neutral-50 min-h-[85vh] py-12">
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs font-mono uppercase tracking-widest text-[#767676] flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
            <span>Loading Tracking Concierge...</span>
          </div>
        }
      >
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
