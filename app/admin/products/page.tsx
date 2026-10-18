"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [familyFilter, setFamilyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc" | "date">("date");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Dialog State
  const [selectedProductForAction, setSelectedProductForAction] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<"archive" | "toggle-status" | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchFamily = p.family.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchFamily) return false;
    }

    // 2. Status filter
    if (statusFilter !== "all") {
      const pStatus = p.status || "published";
      if (pStatus !== statusFilter) return false;
    }

    // 3. Fragrance Family filter
    if (familyFilter !== "all") {
      if (p.fragranceFamily !== familyFilter) return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "stock-asc") return (a.stock ?? 0) - (b.stock ?? 0);
    if (sortBy === "stock-desc") return (b.stock ?? 0) - (a.stock ?? 0);
    if (sortBy === "date") {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    }
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfirmAction = async () => {
    if (!selectedProductForAction) return;
    setIsProcessingAction(true);

    try {
      if (actionType === "archive") {
        const res = await fetch(`/api/admin/products/${selectedProductForAction.id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok) {
          setActionMessage(data.message || `Archived ${selectedProductForAction.name}.`);
          fetchProducts();
        }
      } else if (actionType === "toggle-status") {
        const nextStatus = selectedProductForAction.status === "draft" ? "published" : "draft";
        const res = await fetch(`/api/admin/products/${selectedProductForAction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        });
        if (res.ok) {
          setActionMessage(`Updated ${selectedProductForAction.name} status to ${nextStatus}.`);
          fetchProducts();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAction(false);
      setSelectedProductForAction(null);
      setActionType(null);
      setTimeout(() => setActionMessage(null), 3500);
    }
  };

  return (
    <AdminLayout
      title="Product Catalog Management"
      subtitle="Full administration of luxury perfumes, fragrance families, inventory stock, and public visibility."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Products Catalog" },
      ]}
      actions={
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium rounded-sm flex items-center gap-2"
        >
          <span>+ Create Fragrance</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {actionMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm">
            {actionMessage}
          </div>
        )}

        {/* Toolbar: Search & Filters */}
        <div className="bg-pure-white p-4 sm:p-5 rounded-card border border-soft-stone shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by perfume title, SKU, or family..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-warm-ivory/40 border border-soft-stone px-3 py-2 rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>

            {/* Family Filter */}
            <select
              value={familyFilter}
              onChange={(e) => {
                setFamilyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-warm-ivory/40 border border-soft-stone px-3 py-2 rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
              aria-label="Filter by fragrance family"
            >
              <option value="all">All Families</option>
              <option value="woody">Woody</option>
              <option value="floral">Floral</option>
              <option value="fresh">Fresh</option>
              <option value="amber-oriental">Amber &amp; Oriental</option>
            </select>

            {/* Sort Control */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-warm-ivory/40 border border-soft-stone px-3 py-2 rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
              aria-label="Sort products"
            >
              <option value="date">Sort: Recently Updated</option>
              <option value="name">Sort: Name (A–Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-pure-white rounded-card border border-soft-stone shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-ivory/60 border-b border-soft-stone text-muted-taupe uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Fragrance</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">SKU</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Family</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Price</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Stock</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Visibility</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-stone/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-taupe">
                      Loading catalog from central database...
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-taupe space-y-2">
                      <p className="font-serif text-lg text-charcoal">No perfumes match your current filter criteria.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                          setFamilyFilter("all");
                        }}
                        className="text-xs text-champagne underline"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => {
                    const stock = p.stock ?? 0;
                    const isLowStock = stock <= (p.lowStockThreshold ?? 10);
                    const pStatus = p.status || "published";

                    return (
                      <tr key={p.id} className="hover:bg-warm-ivory/20 transition-colors">
                        {/* Fragrance details */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-14 bg-soft-stone/30 rounded overflow-hidden shrink-0 border border-soft-stone/60">
                              <Image
                                src={p.images?.[0] || p.image}
                                alt={p.name}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/admin/products/${p.id}/edit`}
                                className="font-serif text-sm font-medium text-charcoal hover:text-champagne transition-colors block truncate"
                              >
                                {p.name}
                              </Link>
                              <span className="text-[11px] text-muted-taupe block">
                                {p.size || `${p.sizeMl}ml Extrait`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-4 py-3.5 font-mono text-[11px] text-charcoal">
                          {p.sku || `VEL-${p.slug.toUpperCase().slice(0, 8)}-100`}
                        </td>

                        {/* Family */}
                        <td className="px-4 py-3.5 text-muted-taupe">
                          <span className="inline-block bg-warm-ivory px-2 py-0.5 rounded text-[11px] border border-soft-stone/80 text-charcoal">
                            {p.family}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3.5 font-medium text-charcoal font-serif text-sm">
                          {formatCurrency(p.price)}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                stock === 0
                                  ? "bg-red-500"
                                  : isLowStock
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                stock === 0 ? "text-red-700" : isLowStock ? "text-amber-800" : "text-charcoal"
                              }`}
                            >
                              {stock} units
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                              pStatus === "published"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : pStatus === "draft"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-stone-200 text-stone-700 border border-stone-300"
                            }`}
                          >
                            {pStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="inline-block px-2.5 py-1 text-[11px] uppercase tracking-wider bg-warm-ivory border border-soft-stone hover:border-charcoal text-charcoal rounded transition-colors"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductForAction(p);
                              setActionType("toggle-status");
                            }}
                            className="inline-block px-2 py-1 text-[11px] text-muted-taupe hover:text-charcoal transition-colors"
                            title={pStatus === "published" ? "Unpublish to Draft" : "Publish to Store"}
                          >
                            {pStatus === "published" ? "Unpublish" : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductForAction(p);
                              setActionType("archive");
                            }}
                            className="inline-block px-2 py-1 text-[11px] text-muted-taupe hover:text-red-700 transition-colors"
                            title="Archive Product"
                          >
                            Archive
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-5 py-3.5 bg-warm-ivory/40 border-t border-soft-stone flex items-center justify-between text-xs text-muted-taupe">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} fragrances
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 border border-soft-stone rounded bg-pure-white disabled:opacity-40 hover:border-charcoal"
                >
                  Previous
                </button>
                <span className="px-2 text-charcoal font-medium">
                  {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 border border-soft-stone rounded bg-pure-white disabled:opacity-40 hover:border-charcoal"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(selectedProductForAction && actionType)}
        title={
          actionType === "archive"
            ? `Archive ${selectedProductForAction?.name}?`
            : selectedProductForAction?.status === "published"
            ? `Unpublish ${selectedProductForAction?.name}?`
            : `Publish ${selectedProductForAction?.name}?`
        }
        message={
          actionType === "archive"
            ? "Archiving will remove this perfume from the public storefront while safely retaining all historical order references and purchase invoices."
            : selectedProductForAction?.status === "published"
            ? "Unpublishing will withdraw this fragrance from the public storefront into draft mode."
            : "Publishing will immediately make this fragrance live and discoverable on the storefront."
        }
        confirmLabel={
          actionType === "archive"
            ? "Archive Perfume"
            : selectedProductForAction?.status === "published"
            ? "Unpublish"
            : "Publish"
        }
        isDestructive={actionType === "archive"}
        isLoading={isProcessingAction}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setSelectedProductForAction(null);
          setActionType(null);
        }}
      />
    </AdminLayout>
  );
}
