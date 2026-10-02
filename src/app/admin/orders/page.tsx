'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  RotateCcw,
  Loader2,
  ExternalLink,
  Eye,
  MapPin,
  X,
  PackageCheck,
  Package,
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
        showToast(`Order status updated to ${newStatus}.`);
      } else {
        showToast('Failed to transition order status.');
      }
    } catch {
      showToast('Error updating order.');
    }
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
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-300';
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' ? true : o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper to parse address
  const parseAddress = (shippingAddress?: string | null) => {
    if (!shippingAddress) return null;
    try {
      return JSON.parse(shippingAddress);
    } catch {
      return { raw: shippingAddress };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-1">
            Fulfillment & Delivery Ledger
          </span>
          <h1 className="font-serif text-3xl font-light text-[#111111] uppercase tracking-wide">
            Atelier Client Orders
          </h1>
          <p className="text-xs text-[#767676] mt-1">
            Manage Stripe payment settlements, atelier preparation, white-glove courier carriage, and delivery status.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="self-start sm:self-auto text-xs font-mono uppercase tracking-wider px-3.5 py-2 border border-[#E5E5E5] hover:border-[#111111] transition-colors"
        >
          Refresh Ledger
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 border border-[#E5E5E5] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, email, name..."
            className="w-full pl-9 pr-3 py-2 border border-[#E5E5E5] text-xs text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111]"
          />
          <Search size={14} className="text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono uppercase text-[#767676] mr-1">Status:</span>
          {(
            [
              'ALL',
              'PENDING',
              'PAID',
              'PROCESSING',
              'DISPATCHED',
              'DELIVERED',
              'CANCELLED',
              'REFUNDED',
            ] as const
          ).map((s) => (
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

      {/* Orders Table */}
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
            No client orders found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-neutral-50 text-[10px] font-mono uppercase tracking-widest text-[#767676]">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Pieces</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
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
                    <td className="py-3.5 px-4 text-[#767676] font-mono text-[11px] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 text-[#111111]">
                      <div className="font-medium">{order.customerEmail}</div>
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
                        <span className="text-[#767676] italic">Pending allocation</span>
                      )}
                    </td>

                    {/* Total in Pence */}
                    <td className="py-3.5 px-4 font-mono text-[#111111] font-medium whitespace-nowrap">
                      {formatPence(order.totalInPence)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* View Details */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#111111] hover:text-[#C5A869] underline underline-offset-2 transition-colors"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>

                    {/* Transition Control */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-[11px] font-mono border border-[#E5E5E5] px-2 py-1 bg-white focus:outline-none focus:border-[#111111]"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="DELIVERED">DELIVERED</option>
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

      {/* Order Fulfillment Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#E5E5E5] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-[#111111] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#C5A869] block">
                Atelier Fulfillment Dossier
              </span>
              <h2 className="font-serif text-2xl font-light text-[#111111] uppercase tracking-wide">
                Order {selectedOrder.orderNumber}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  Status: {selectedOrder.status}
                </span>
                <span className="text-xs text-[#767676] font-mono">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-GB')}
                </span>
              </div>
            </div>

            {/* Quick Status Workflow Buttons */}
            <div className="bg-neutral-50 p-3 border border-[#E5E5E5] flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-[#767676]">Quick Action:</span>
              <button
                onClick={() => handleStatusChange(selectedOrder.id, 'PROCESSING')}
                className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-purple-600 hover:text-purple-700 transition-colors"
              >
                Mark Processing
              </button>
              <button
                onClick={() => handleStatusChange(selectedOrder.id, 'DISPATCHED')}
                className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-blue-600 hover:text-blue-700 transition-colors"
              >
                Mark Dispatched
              </button>
              <button
                onClick={() => handleStatusChange(selectedOrder.id, 'DELIVERED')}
                className="px-2.5 py-1 bg-white border border-[#E5E5E5] hover:border-teal-600 hover:text-teal-700 transition-colors"
              >
                Mark Delivered
              </button>
            </div>

            {/* Customer & Shipping Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 border border-[#E5E5E5] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#767676] block">
                  Client Information
                </span>
                <p className="font-medium text-[#111111]">
                  {selectedOrder.customerName || 'ACEMEN Patron'}
                </p>
                <p className="text-[#767676]">{selectedOrder.customerEmail}</p>
                <p className="text-[11px] font-mono text-[#767676] pt-1">
                  Stripe ID: {selectedOrder.stripePaymentIntentId || selectedOrder.stripeSessionId || 'Direct'}
                </p>
              </div>

              <div className="p-4 border border-[#E5E5E5] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#767676] block">
                  Delivery Destination
                </span>
                {(() => {
                  const addr = parseAddress(selectedOrder.shippingAddress);
                  if (!addr) {
                    return <p className="text-neutral-400 italic">No address provided</p>;
                  }
                  if (addr.raw) {
                    return <p className="text-[#111111]">{addr.raw}</p>;
                  }
                  return (
                    <div className="text-[#111111] leading-relaxed">
                      {addr.line1 && <div>{addr.line1}</div>}
                      {addr.line2 && <div>{addr.line2}</div>}
                      <div>
                        {[addr.city, addr.state, addr.postal_code].filter(Boolean).join(', ')}
                      </div>
                      <div className="font-medium text-[11px] font-mono">{addr.country}</div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Ordered Pieces */}
            <div className="border border-[#E5E5E5] divide-y divide-[#E5E5E5] text-xs">
              <div className="p-3 bg-neutral-50 font-mono text-[10px] uppercase text-[#767676] flex justify-between">
                <span>Ordered Pieces</span>
                <span>Subtotal: {formatPence(selectedOrder.totalInPence)}</span>
              </div>
              <div className="divide-y divide-[#E5E5E5] max-h-48 overflow-y-auto">
                {selectedOrder.orderItems?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[#111111]">{item.title}</div>
                      <div className="text-[11px] text-[#767676] font-mono space-x-2">
                        <span>SKU: {item.sku}</span>
                        <span>•</span>
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
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider hover:bg-black transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
