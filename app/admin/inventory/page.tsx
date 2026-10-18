"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatCurrency } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  family: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  status: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
  updatedAt?: string;
}

interface InventoryHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  adjustment: number;
  reason: string;
  timestamp: string;
  adminEmail: string;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<InventoryHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  // Adjustment Modal
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState<string>("5");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add");
  const [reason, setReason] = useState("Received New Atelier Batch");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      if (res.ok) {
        const data = await res.json();
        setItems(data.inventory || []);
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAdjustModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentValue("5");
    setAdjustmentType("add");
    setReason("Received New Atelier Batch");
    setModalError(null);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const val = Number(adjustmentValue);
    if (isNaN(val) || val <= 0) {
      setModalError("Please enter a valid positive quantity to adjust.");
      return;
    }

    const finalAdjustment = adjustmentType === "add" ? val : -val;

    if (selectedItem.stock + finalAdjustment < 0) {
      setModalError(`Cannot reduce stock below zero. Current stock is ${selectedItem.stock}.`);
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedItem.id,
          adjustment: finalAdjustment,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.error || "Failed to update inventory.");
        setIsSubmitting(false);
        return;
      }

      setFeedback(data.message || "Stock successfully updated.");
      setSelectedItem(null);
      fetchInventory();
    } catch (err: any) {
      setModalError("Network error while updating inventory.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }

    if (stockFilter === "low") return item.isLowStock;
    if (stockFilter === "out") return item.isOutOfStock;
    return true;
  });

  const lowStockCount = items.filter((i) => i.isLowStock).length;
  const outOfStockCount = items.filter((i) => i.isOutOfStock).length;

  return (
    <AdminLayout
      title="Inventory Management &amp; Stock Alerts"
      subtitle="Monitor flacon stocks, configure replenishment thresholds, and record auditable stock adjustments."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Inventory" },
      ]}
    >
      <div className="space-y-8">
        {feedback && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm">
            {feedback}
          </div>
        )}

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
            <span className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold block mb-1">
              Total Catalogued Editions
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
              {isLoading ? "..." : items.length}
            </span>
            <span className="text-[11px] text-muted-taupe block mt-2">
              Across all fragrance families
            </span>
          </div>

          <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
            <span className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold block mb-1">
              Low-Stock Warnings (&le; 10 Units)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-amber-800">
                {isLoading ? "..." : lowStockCount}
              </span>
              <span className="text-xs text-amber-800">Atelier Attention</span>
            </div>
            <span className="text-[11px] text-muted-taupe block mt-2">
              Requires scheduled bottling dispatch
            </span>
          </div>

          <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
            <span className="text-[10px] uppercase tracking-widest text-muted-taupe font-semibold block mb-1">
              Depleted / Out of Stock
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-red-700">
                {isLoading ? "..." : outOfStockCount}
              </span>
              <span className="text-xs text-red-700">Zero Stock</span>
            </div>
            <span className="text-[11px] text-muted-taupe block mt-2">
              Automatically paused on storefront
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-pure-white p-4 sm:p-5 rounded-card border border-soft-stone shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by perfume name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
            />
            <svg
              className="w-4 h-4 text-muted-taupe absolute left-3 top-2.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStockFilter("all")}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                stockFilter === "all"
                  ? "bg-charcoal text-pure-white border-charcoal"
                  : "bg-warm-ivory/40 text-charcoal border-soft-stone hover:border-champagne"
              }`}
            >
              All Items ({items.length})
            </button>

            <button
              type="button"
              onClick={() => setStockFilter("low")}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                stockFilter === "low"
                  ? "bg-amber-800 text-pure-white border-amber-800"
                  : "bg-warm-ivory/40 text-amber-800 border-soft-stone hover:border-amber-700"
              }`}
            >
              Low Stock ({lowStockCount})
            </button>

            <button
              type="button"
              onClick={() => setStockFilter("out")}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                stockFilter === "out"
                  ? "bg-red-800 text-pure-white border-red-800"
                  : "bg-warm-ivory/40 text-red-800 border-soft-stone hover:border-red-700"
              }`}
            >
              Depleted ({outOfStockCount})
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-pure-white rounded-card border border-soft-stone shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-ivory/60 border-b border-soft-stone text-muted-taupe uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Fragrance</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">SKU</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Retail Price</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">In Stock</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-stone/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-taupe">
                      Loading inventory records...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-taupe">
                      No inventory records match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-warm-ivory/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-soft-stone/30 rounded overflow-hidden shrink-0 border border-soft-stone">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${item.id}/edit`}
                              className="font-serif text-sm font-medium text-charcoal hover:text-champagne transition-colors block"
                            >
                              {item.name}
                            </Link>
                            <span className="text-[11px] text-muted-taupe block">
                              {item.family}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-charcoal">
                        {item.sku}
                      </td>

                      <td className="px-4 py-3.5 font-serif text-sm text-charcoal font-medium">
                        {formatCurrency(item.price)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`font-semibold text-sm ${
                            item.stock === 0
                              ? "text-red-700"
                              : item.isLowStock
                              ? "text-amber-800"
                              : "text-charcoal"
                          }`}
                        >
                          {item.stock} flacons
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {item.stock === 0 ? (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-red-100 text-red-800 border border-red-200">
                            Depleted
                          </span>
                        ) : item.isLowStock ? (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-green-100 text-green-800 border border-green-200">
                            Adequate Reserve
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => openAdjustModal(item)}
                          className="px-3 py-1 text-xs uppercase tracking-wider bg-warm-ivory border border-soft-stone hover:border-charcoal text-charcoal rounded transition-colors"
                        >
                          Adjust Stock &plusmn;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log / Inventory History */}
        <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-4">
          <div className="border-b border-soft-stone pb-3">
            <h3 className="font-serif text-lg text-charcoal font-medium">
              Recent Inventory Audit Trail
            </h3>
            <p className="text-[11px] text-muted-taupe">
              Logged stock adjustments with verified administrative attribution and reasons.
            </p>
          </div>

          <div className="divide-y divide-soft-stone/60">
            {history.length === 0 ? (
              <p className="text-xs text-muted-taupe py-4 text-center">No audit logs recorded yet.</p>
            ) : (
              history.slice(0, 8).map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-medium text-charcoal">{log.productName}</span>
                    <span className="text-muted-taupe ml-2">({log.reason})</span>
                    <span className="block text-[11px] text-muted-taupe">
                      {new Date(log.timestamp).toLocaleString()} &bull; Admin: {log.adminEmail}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-muted-taupe">
                      {log.previousStock} → <strong className="text-charcoal">{log.newStock}</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                        log.adjustment > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 max-w-md w-full shadow-modal space-y-5">
            <div className="border-b border-soft-stone pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block">
                  Inventory Reconciliation
                </span>
                <h3 className="font-serif text-xl text-charcoal">
                  {selectedItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 text-muted-taupe hover:text-charcoal"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="bg-warm-ivory p-3 rounded-sm border border-soft-stone flex items-center justify-between">
                <span className="text-muted-taupe">Current Recorded Reserve:</span>
                <span className="font-semibold text-charcoal font-serif text-base">
                  {selectedItem.stock} flacons
                </span>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("add")}
                    className={`py-2 text-xs uppercase tracking-wider rounded-sm border font-medium ${
                      adjustmentType === "add"
                        ? "bg-charcoal text-pure-white border-charcoal"
                        : "bg-pure-white text-charcoal border-soft-stone"
                    }`}
                  >
                    + Add Flacons (Restock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("subtract")}
                    className={`py-2 text-xs uppercase tracking-wider rounded-sm border font-medium ${
                      adjustmentType === "subtract"
                        ? "bg-red-800 text-pure-white border-red-800"
                        : "bg-pure-white text-charcoal border-soft-stone"
                    }`}
                  >
                    − Deduct Flacons
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustmentValue}
                  onChange={(e) => setAdjustmentValue(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Reason for Adjustment *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
                >
                  <option value="Received New Atelier Batch">Received New Atelier Batch</option>
                  <option value="Inventory Count Reconciliation">Inventory Count Reconciliation</option>
                  <option value="Damaged Flacon Write-off">Damaged Flacon Write-off</option>
                  <option value="VIP Allocation Reserve">VIP Allocation Reserve</option>
                  <option value="Atelier Quality Inspection">Atelier Quality Inspection</option>
                </select>
              </div>

              <div className="pt-3 border-t border-soft-stone flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border border-soft-stone rounded-sm text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-charcoal text-pure-white rounded-sm text-xs uppercase tracking-widest font-medium hover:bg-champagne hover:text-charcoal transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Apply Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
