import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Plus,
  Image as ImageIcon,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { formatPence } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Query live metrics from database
  let totalProducts = 0;
  let lowStockVariants: any[] = [];
  let recentOrders: any[] = [];
  let totalRevenuePence = 0;

  try {
    totalProducts = await prisma.product.count({
      where: { status: 'ACTIVE' },
    });

    lowStockVariants = await prisma.variant.findMany({
      where: {
        stockQuantity: { lte: 3 },
        isActive: true,
      },
      include: {
        product: true,
      },
      take: 8,
    });

    recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
      },
    });

    const paidOrders = await prisma.order.findMany({
      where: { status: 'PAID' },
      select: { totalInPence: true },
    });
    totalRevenuePence = paidOrders.reduce((sum, o) => sum + o.totalInPence, 0);
  } catch (err) {
    console.error('[Admin Dashboard DB Error]', err);
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#767676] block mb-1">
            Executive Overview
          </span>
          <h1 className="font-serif text-3xl font-light text-[#111111] uppercase tracking-wide">
            Atelier Metrics & Allocations
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products/new"
            className="bg-[#111111] hover:bg-black text-white text-xs uppercase tracking-widest px-4 py-2.5 transition-colors flex items-center space-x-2 font-medium"
          >
            <Plus size={14} />
            <span>New Leather Piece</span>
          </Link>

          <Link
            href="/admin/media"
            className="bg-white border border-[#E5E5E5] hover:border-[#111111] text-[#111111] text-xs uppercase tracking-widest px-4 py-2.5 transition-colors flex items-center space-x-2"
          >
            <ImageIcon size={14} />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-[#767676] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Active Masterpieces</span>
            <Package size={16} />
          </div>
          <div className="font-serif text-3xl font-light text-[#111111]">
            {totalProducts}
          </div>
          <div className="mt-2 text-[10px] text-[#767676]">
            Catalog pieces currently available
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-amber-700 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Low Stock Variants</span>
            <AlertTriangle size={16} />
          </div>
          <div className="font-serif text-3xl font-light text-amber-800">
            {lowStockVariants.length}
          </div>
          <div className="mt-2 text-[10px] text-[#767676]">
            Variants with 3 or fewer units remaining
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-[#767676] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Recorded Orders</span>
            <ShoppingBag size={16} />
          </div>
          <div className="font-serif text-3xl font-light text-[#111111]">
            {recentOrders.length}
          </div>
          <div className="mt-2 text-[10px] text-[#767676]">
            Orders logged in atelier database
          </div>
        </div>

        {/* Settled Revenue */}
        <div className="bg-white p-5 border border-[#E5E5E5]">
          <div className="flex items-center justify-between text-[#767676] text-xs font-mono uppercase tracking-wider mb-2">
            <span>Settled Revenue</span>
            <CheckCircle size={16} />
          </div>
          <div className="font-mono text-2xl font-light text-[#111111]">
            {formatPence(totalRevenuePence)}
          </div>
          <div className="mt-2 text-[10px] text-[#767676]">
            Verified Stripe paid volume
          </div>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Warning + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock List */}
        <div className="lg:col-span-5 bg-white border border-[#E5E5E5] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} className="text-amber-700" />
              <h2 className="font-serif text-lg font-light uppercase tracking-wide text-[#111111]">
                Critical Allocations
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-[10px] uppercase tracking-widest text-[#767676] hover:text-[#111111]"
            >
              Manage
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#767676]">
              All product variants maintain healthy inventory levels.
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5]">
              {lowStockVariants.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-[#111111]">{v.product.title}</div>
                    <div className="text-[11px] text-[#767676] font-mono">
                      {v.size} • {v.color} • {v.sku}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                    {v.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-7 bg-white border border-[#E5E5E5] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <h2 className="font-serif text-lg font-light uppercase tracking-wide text-[#111111]">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[10px] uppercase tracking-widest text-[#767676] hover:text-[#111111] flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#767676]">
              No checkout orders recorded in database yet.
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5]">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-medium text-[#111111]">{o.orderNumber}</div>
                    <div className="text-[11px] text-[#767676]">{o.customerEmail}</div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${
                        o.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : o.status === 'DISPATCHED'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {o.status}
                    </span>
                    <span className="font-mono font-medium text-[#111111]">
                      {formatPence(o.totalInPence)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
