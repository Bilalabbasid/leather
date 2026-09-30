'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  RotateCcw,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Order } from '@/lib/types';
import { formatPence } from '@/lib/config';
import { useStore } from '@/lib/store';

export default function AdminOrdersPage() {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
        showToast(`Order status updated to ${newStatus}.`);
      } else {
        showToast('Failed to transition order status.');
      }
    } catch {
      showToast('Error updating order.');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' ? true : o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-1">
          Fulfillment & Ledger
        </span>
        <h1 className="font-serif text-3xl font-light text-[#111111] uppercase tracking-wide">
          Atelier Client Orders
        </h1>
        <p className="text-xs text-[#767676] mt-1">
          All client allocations, Stripe checkout settlements, and white-glove dispatch lifecycle.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 border border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, email..."
            className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111]"
          />
          <Search size={14} className="text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono uppercase text-[#767676]">Status:</span>
          {(['ALL', 'PENDING', 'PAID', 'DISPATCHED', 'CANCELLED', 'REFUNDED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[10px] uppercase font-mono px-2.5 py-1 border transition-colors whitespace-nowrap ${
                statusFilter === s
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#E5E5E5] text-[#767676] hover:border-neutral-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#767676]">
              Loading Orders Ledger...
            </span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#767676]">
            No client orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-neutral-50 text-[10px] font-mono uppercase tracking-widest text-[#767676]">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer Email</th>
                  <th className="py-3 px-4">Pieces</th>
                  <th className="py-3 px-4">Settlement Total</th>
                  <th className="py-3 px-4">Stripe Reference</th>
                  <th className="py-3 px-4">Lifecycle Status</th>
                  <th className="py-3 px-4 text-right">Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Order Reference */}
                    <td className="py-3.5 px-4 font-mono font-medium text-[#111111]">
                      {order.orderNumber}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#767676] font-mono text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 text-[#111111]">
                      <div>{order.customerEmail}</div>
                      {order.customerName && (
                        <div className="text-[10px] text-[#767676]">{order.customerName}</div>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="space-y-0.5">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="text-[11px] text-[#767676]">
                              {item.quantity}x {item.title} ({item.size})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#767676] italic">Pending cart</span>
                      )}
                    </td>

                    {/* Total in Pence */}
                    <td className="py-3.5 px-4 font-mono text-[#111111] font-medium">
                      {formatPence(order.totalInPence)}
                    </td>

                    {/* Stripe Reference */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#767676] truncate max-w-[140px]">
                      {order.stripePaymentIntentId || order.stripeSessionId || 'Pending'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${
                          order.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.status === 'DISPATCHED'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : order.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Transition Control */}
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-[11px] font-mono border border-[#E5E5E5] px-2 py-1 bg-white focus:outline-none focus:border-[#111111]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
