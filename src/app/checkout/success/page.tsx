'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Loader2,
  Clock,
  Package,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPence } from '@/lib/config';

interface OrderItemData {
  id: string;
  title: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceInPence: number;
  lineTotalInPence: number;
}

interface ConfirmedOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalInPence: number;
  currency: string;
  customerEmail: string;
  customerName?: string | null;
  shippingAddress?: string | null;
  orderItems: OrderItemData[];
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const orderId = searchParams.get('order_id') || '';
  const { clearCart } = useStore();

  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear shopping cart on successful checkout
    clearCart();

    const confirmOrder = async () => {
      try {
        const res = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, orderId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          }
        }
      } catch (err) {
        console.error('Failed to confirm order status', err);
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [sessionId, orderId, clearCart]);

  // Parse shipping address if present
  let parsedAddress: any = null;
  if (order?.shippingAddress) {
    try {
      parsedAddress = JSON.parse(order.shippingAddress);
    } catch {
      // not json
    }
  }

  const orderNumber = order?.orderNumber || (orderId ? `Order #${orderId.slice(0, 8)}` : 'ACM-ALLOCATION-CONFIRMED');

  const deliverySteps = [
    { title: 'Allocation Confirmed', desc: 'Payment authenticated via Stripe', done: true },
    {
      title: 'Atelier Inspection & Conditioning',
      desc: 'Master inspection and organic beeswax treatment',
      done: order?.status !== 'PENDING',
      active: order?.status === 'PAID' || order?.status === 'PROCESSING',
    },
    {
      title: 'White-Glove Dispatch',
      desc: 'Insured express courier carriage',
      done: order?.status === 'DISPATCHED' || order?.status === 'DELIVERED',
      active: order?.status === 'DISPATCHED',
    },
    {
      title: 'Delivered',
      desc: 'Signed delivery at destination',
      done: order?.status === 'DELIVERED',
      active: order?.status === 'DELIVERED',
    },
  ];

  return (
    <div className="max-w-2xl w-full border border-[#E5E5E5] p-6 sm:p-10 bg-white text-center space-y-8 shadow-sm">
      {/* Crest & Icon */}
      <div className="w-16 h-16 bg-[#111111] text-white flex items-center justify-center mx-auto">
        <CheckCircle2 size={32} strokeWidth={1.5} />
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A869] block font-semibold">
          Payment Authenticated • London Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#111111] tracking-tight uppercase">
          Allocation Confirmed
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs text-[#767676]">
          <span>Order Ref:</span>
          <span className="text-[#111111] font-semibold bg-neutral-100 px-2 py-0.5 border border-[#E5E5E5]">
            {orderNumber}
          </span>
          {order && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase text-[10px]">
              Status: {order.status}
            </span>
          )}
        </div>
      </div>

      <div className="w-16 h-[1px] bg-[#E5E5E5] mx-auto" />

      {/* Delivery Progress Bar */}
      <div className="text-left bg-neutral-50 border border-[#E5E5E5] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#767676] block">
            Delivery & Atelier Timeline
          </span>
          <span className="text-[10px] font-mono text-[#111111] flex items-center gap-1">
            <Clock size={12} className="text-[#C5A869]" /> Express Insured Carriage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {deliverySteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 border text-xs transition-colors ${
                step.done
                  ? 'border-emerald-500/40 bg-emerald-50/50'
                  : step.active
                  ? 'border-[#111111] bg-white ring-1 ring-[#111111]'
                  : 'border-[#E5E5E5] bg-neutral-100/60 opacity-60'
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

      {/* Order Items Breakdown */}
      {order && order.orderItems && order.orderItems.length > 0 && (
        <div className="text-left border border-[#E5E5E5] bg-white divide-y divide-[#E5E5E5]">
          <div className="p-4 bg-neutral-50 flex items-center justify-between text-xs font-mono uppercase text-[#767676]">
            <span>Acquired Pieces</span>
            <span>Total: {formatPence(order.totalInPence)}</span>
          </div>
          <div className="divide-y divide-[#E5E5E5] max-h-60 overflow-y-auto">
            {order.orderItems.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-medium text-[#111111]">{item.title}</h4>
                  <div className="text-[11px] text-[#767676] space-x-2 mt-0.5 font-mono">
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>Color: {item.color}</span>
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="font-mono font-medium text-[#111111]">
                  {formatPence(item.lineTotalInPence)}
                </div>
              </div>
            ))}
          </div>

          {parsedAddress && (
            <div className="p-4 bg-neutral-50/50 text-xs flex items-start gap-2 text-[#767676]">
              <MapPin size={14} className="text-[#111111] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#111111] block">Dispatch Destination:</span>
                <span>
                  {[
                    order.customerName,
                    parsedAddress.line1,
                    parsedAddress.line2,
                    parsedAddress.city,
                    parsedAddress.postal_code,
                    parsedAddress.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Courier & Security Assurance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="p-4 bg-neutral-50 border border-[#E5E5E5] space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-[#111111]">
            <Truck size={14} />
            <span className="uppercase tracking-wider">Express Courier</span>
          </div>
          <p className="text-[11px] text-[#767676]">
            Insured global carriage with signature verification required upon delivery.
          </p>
        </div>

        <div className="p-4 bg-neutral-50 border border-[#E5E5E5] space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-[#111111]">
            <ShieldCheck size={14} />
            <span className="uppercase tracking-wider">Atelier Provenance</span>
          </div>
          <p className="text-[11px] text-[#767676]">
            Accompanied by serial verification document and breathable garment protection.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/track-order?orderNumber=${encodeURIComponent(order?.orderNumber || '')}`}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-[#111111] hover:bg-neutral-50 text-[#111111] text-xs uppercase tracking-[0.2em] font-medium px-6 py-3.5 transition-colors"
        >
          <Package size={14} />
          <span>Track Order Delivery</span>
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium px-8 py-3.5 transition-colors"
        >
          <span>Return to Storefront</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-neutral-50 min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-[#111111]">
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs font-mono uppercase tracking-widest text-[#767676] flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
            <span>Authenticating Payment & Allocation...</span>
          </div>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
