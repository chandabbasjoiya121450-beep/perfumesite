"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/data/products";
import { Order } from "@/lib/data/orders";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [prodRes, ordRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders"),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
        }

        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData.orders || []);
        }
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Compute actual metrics from database records
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.status === "published" || !p.status).length;
  const draftProducts = products.filter((p) => p.status === "draft").length;
  const lowStockProducts = products.filter((p) => {
    const stock = p.stock ?? 0;
    const threshold = p.lowStockThreshold ?? 10;
    return stock <= threshold;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "Preparing Dispatch" || o.status === "Confirmed"
  ).length;

  // Real paid revenue from delivered and processing orders (excluding cancelled)
  const eligibleOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalRevenue = eligibleOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const recentOrders = orders.slice(0, 5);
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminLayout
      title="Executive Overview"
      subtitle="Real-time catalog metrics, inventory alerts, and order dispatches from the VELORÉ reserve."
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium rounded-sm flex items-center gap-2"
          >
            <span>+ New Fragrance</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Revenue */}
          <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold block mb-1">
                Eligible Order Revenue
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                {isLoading ? "..." : formatCurrency(totalRevenue)}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-soft-stone/60 text-[11px] text-muted-taupe">
              Calculated from {eligibleOrders.length} confirmed orders
            </div>
          </div>

          {/* Pending Dispatches */}
          <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold block mb-1">
                Awaiting Processing
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                  {isLoading ? "..." : pendingOrders}
                </span>
                <span className="text-xs text-amber-700 font-medium">Orders</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-soft-stone/60 text-[11px] text-muted-taupe">
              {totalOrders} total recorded orders
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold block mb-1">
                Active Catalog
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                  {isLoading ? "..." : publishedProducts}
                </span>
                <span className="text-xs text-muted-taupe">/ {totalProducts} total</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-soft-stone/60 text-[11px] text-muted-taupe flex items-center justify-between">
              <span>{draftProducts} draft {draftProducts === 1 ? "edition" : "editions"}</span>
              <Link href="/admin/products" className="text-champagne hover:underline">
                View all →
              </Link>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold block mb-1">
                Low-Stock Alerts
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-amber-800">
                  {isLoading ? "..." : lowStockProducts.length}
                </span>
                <span className="text-xs text-muted-taupe">&le; 10 flacons</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-soft-stone/60 text-[11px] text-muted-taupe flex items-center justify-between">
              <span>{lowStockProducts.length > 0 ? "Replenishment required" : "Inventory healthy"}</span>
              <Link href="/admin/inventory" className="text-champagne hover:underline">
                Manage →
              </Link>
            </div>
          </div>
        </div>

        {/* Low Stock Warning Banner if items need attention */}
        {lowStockProducts.length > 0 && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="text-amber-900 font-medium">
                {lowStockProducts.length} {lowStockProducts.length === 1 ? "fragrance has" : "fragrances have"} dipped below the atelier replenishment threshold:
              </span>
              <span className="text-amber-800 hidden md:inline">
                {lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(", ")}
              </span>
            </div>
            <Link
              href="/admin/inventory"
              className="text-amber-900 font-semibold underline hover:text-amber-950 shrink-0"
            >
              Adjust Inventory Levels →
            </Link>
          </div>
        )}

        {/* Two-Column Grid: Recent Orders & Recently Updated Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Recent Orders (7 cols) */}
          <div className="lg:col-span-7 bg-pure-white rounded-card border border-soft-stone shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-soft-stone pb-3">
              <div>
                <h3 className="font-serif text-lg text-charcoal font-medium">Recent Orders</h3>
                <p className="text-[11px] text-muted-taupe">Latest client acquisitions from the storefront.</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs uppercase tracking-wider text-charcoal hover:text-champagne transition-colors font-medium"
              >
                View All Orders →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-muted-taupe py-6 text-center">No orders recorded yet.</p>
            ) : (
              <div className="divide-y divide-soft-stone/60">
                {recentOrders.map((ord) => (
                  <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="font-mono font-medium text-charcoal hover:text-champagne transition-colors block text-sm"
                      >
                        {ord.id}
                      </Link>
                      <span className="text-[11px] text-muted-taupe block">
                        {ord.customer.firstName} {ord.customer.lastName} &bull; {ord.items.length}{" "}
                        {ord.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-sm font-semibold text-charcoal block">
                        {formatCurrency(ord.total)}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                          ord.status === "Delivered"
                            ? "bg-stone-100 text-charcoal"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Catalog Highlights (5 cols) */}
          <div className="lg:col-span-5 bg-pure-white rounded-card border border-soft-stone shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-soft-stone pb-3">
              <div>
                <h3 className="font-serif text-lg text-charcoal font-medium">Active Fragrances</h3>
                <p className="text-[11px] text-muted-taupe">Quick access to manage editions.</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs uppercase tracking-wider text-charcoal hover:text-champagne transition-colors font-medium"
              >
                Catalog →
              </Link>
            </div>

            <div className="divide-y divide-soft-stone/60">
              {recentProducts.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-12 h-14 bg-soft-stone/30 rounded overflow-hidden shrink-0">
                    <Image
                      src={prod.images?.[0] || prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/products/${prod.id}/edit`}
                      className="font-serif text-sm text-charcoal hover:text-champagne font-medium truncate block"
                    >
                      {prod.name}
                    </Link>
                    <span className="text-[11px] text-muted-taupe block">
                      {prod.family} &bull; ${prod.price} &bull; {prod.stock ?? 0} in stock
                    </span>
                  </div>

                  <Link
                    href={`/admin/products/${prod.id}/edit`}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-wider border border-soft-stone hover:border-charcoal rounded text-charcoal transition-colors shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
