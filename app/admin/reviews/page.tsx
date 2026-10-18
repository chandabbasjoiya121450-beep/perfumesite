"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Review, ReviewStatus } from "@/lib/server/store-db";

interface ReviewMetrics {
  totalReviews: number;
  publishedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  reportedReviews: number;
  averageRating: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<ReviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Inspect / Note Modal
  const [inspectingReview, setInspectingReview] = useState<Review | null>(null);
  const [moderationNote, setModerationNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Deletion Dialog
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setMetrics(data.metrics || null);
      } else {
        setError(data.error || "Failed to load customer reviews.");
      }
    } catch (e) {
      setError("Network error while connecting to reviews database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (
    reviewId: string,
    newStatus: ReviewStatus,
    note?: string
  ) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, moderationNote: note }),
      });
      if (res.ok) {
        setInspectingReview(null);
        fetchReviews();
      }
    } catch (e) {
      console.error("Error updating review moderation status", e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${deletingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingId(null);
        fetchReviews();
      }
    } catch (e) {
      console.error("Error deleting review", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "reported") {
      return matchesSearch && r.reports && r.reports.length > 0;
    }
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="Customer Reviews & Impressions"
      subtitle="Moderation workflow, verified-purchase audit, and client feedback management."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Customer Reviews" },
      ]}
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Executive Metrics Bar */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Total Reviews
              </span>
              <span className="font-serif text-3xl font-medium text-charcoal mt-1 block">
                {metrics.totalReviews}
              </span>
              <span className="text-[11px] text-muted-taupe mt-1 block">submitted impressions</span>
            </div>

            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Published
              </span>
              <span className="font-serif text-3xl font-medium text-emerald-700 mt-1 block">
                {metrics.publishedReviews}
              </span>
              <span className="text-[11px] text-muted-taupe mt-1 block">live on storefront</span>
            </div>

            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Pending Moderation
              </span>
              <span className="font-serif text-3xl font-medium text-amber-700 mt-1 block">
                {metrics.pendingReviews}
              </span>
              <span className="text-[11px] text-amber-800 mt-1 block">awaiting approval</span>
            </div>

            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Reported
              </span>
              <span className="font-serif text-3xl font-medium text-red-600 mt-1 block">
                {metrics.reportedReviews}
              </span>
              <span className="text-[11px] text-muted-taupe mt-1 block">flagged by patrons</span>
            </div>

            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Storefront Average
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-serif text-3xl font-medium text-charcoal">
                  {metrics.averageRating.toFixed(1)}
                </span>
                <span className="text-champagne text-base">★</span>
              </div>
              <span className="text-[11px] text-muted-taupe mt-1 block">from published reviews</span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-pure-white p-4 rounded-card border border-soft-stone shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {["all", "pending", "published", "rejected", "removed", "reported"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-colors capitalize ${
                  statusFilter === tab
                    ? "bg-charcoal text-warm-ivory"
                    : "bg-warm-ivory/60 text-muted-taupe hover:text-charcoal"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search product, patron, text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-2.5 text-muted-taupe"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-pure-white rounded-card border border-soft-stone shadow-subtle overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center text-xs uppercase tracking-widest text-muted-taupe">
              Loading customer reviews...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-xs text-red-600">{error}</div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <svg
                className="w-10 h-10 mx-auto text-soft-stone"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <p className="text-sm font-medium text-charcoal">No customer reviews found</p>
              <p className="text-xs text-muted-taupe">
                There are no reviews matching the selected filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-soft-stone bg-warm-ivory/40 uppercase tracking-widest text-[10px] text-muted-taupe font-semibold">
                    <th className="py-3.5 px-4">Fragrance Flacon</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Impression & Title</th>
                    <th className="py-3.5 px-4">Patron Details</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-stone/60">
                  {filteredReviews.map((r) => (
                    <tr key={r.id} className="hover:bg-warm-ivory/20 transition-colors">
                      {/* Product */}
                      <td className="py-4 px-4 font-medium text-charcoal">
                        <Link
                          href={`/products/${r.productSlug}`}
                          className="hover:text-champagne transition-colors underline font-serif text-sm"
                        >
                          {r.productName}
                        </Link>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center text-champagne text-sm tracking-tighter">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= r.rating ? "text-champagne" : "text-soft-stone"}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-1 text-[11px] font-mono font-medium text-charcoal">
                            {r.rating}.0
                          </span>
                        </div>
                      </td>

                      {/* Title & Body */}
                      <td className="py-4 px-4 max-w-sm">
                        <p className="font-semibold text-charcoal truncate">{r.title}</p>
                        <p className="text-[11px] text-muted-taupe line-clamp-2 mt-0.5">{r.body}</p>
                        {r.reports && r.reports.length > 0 && (
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-semibold">
                            ⚠ Reported {r.reports.length} time(s)
                          </span>
                        )}
                      </td>

                      {/* Patron & Verification */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-charcoal">{r.customerName}</p>
                          <p className="text-[10px] text-muted-taupe">{r.customerEmail}</p>
                          {r.verifiedPurchase ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              ✓ Verified Purchase
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400">Unverified Patron</span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-muted-taupe whitespace-nowrap text-[11px]">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                            r.status === "published"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : r.status === "pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : r.status === "rejected"
                              ? "bg-red-50 text-red-800 border border-red-200"
                              : "bg-stone-100 text-stone-600 border border-stone-200"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                        {r.status !== "published" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(r.id, "published")}
                            className="text-emerald-700 hover:text-emerald-900 text-[11px] uppercase tracking-wider font-semibold underline transition-colors"
                          >
                            Approve
                          </button>
                        )}

                        {r.status === "published" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(r.id, "removed")}
                            className="text-amber-700 hover:text-amber-900 text-[11px] uppercase tracking-wider underline transition-colors"
                          >
                            Remove
                          </button>
                        )}

                        {r.status === "pending" && (
                          <>
                            <span className="text-soft-stone">&bull;</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(r.id, "rejected")}
                              className="text-red-700 hover:text-red-900 text-[11px] uppercase tracking-wider underline transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <span className="text-soft-stone">&bull;</span>
                        <button
                          type="button"
                          onClick={() => {
                            setInspectingReview(r);
                            setModerationNote(r.moderationNote || "");
                          }}
                          className="text-muted-taupe hover:text-charcoal text-[11px] uppercase tracking-wider underline transition-colors"
                        >
                          Inspect
                        </button>

                        <span className="text-soft-stone">&bull;</span>
                        <button
                          type="button"
                          onClick={() => setDeletingId(r.id)}
                          className="text-muted-taupe hover:text-red-700 text-[11px] uppercase tracking-wider underline transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inspect & Moderate Modal */}
        {inspectingReview && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-pure-white rounded-card border border-soft-stone max-w-xl w-full p-6 sm:p-8 shadow-modal space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-soft-stone">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block">
                    Review Moderation Atelier
                  </span>
                  <h3 className="font-serif text-xl font-medium text-charcoal">
                    {inspectingReview.productName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingReview(null)}
                  className="p-1 text-muted-taupe hover:text-charcoal"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Rating & Patron */}
                <div className="flex items-center justify-between bg-warm-ivory/40 p-3 rounded border border-soft-stone">
                  <div className="flex items-center gap-1 text-champagne text-base">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= inspectingReview.rating ? "text-champagne" : "text-soft-stone"}>
                        ★
                      </span>
                    ))}
                    <span className="text-charcoal text-xs ml-2 font-semibold">
                      {inspectingReview.rating} out of 5 stars
                    </span>
                  </div>
                  <div>
                    {inspectingReview.verifiedPurchase ? (
                      <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        ✓ Verified Connoisseur Purchase
                      </span>
                    ) : (
                      <span className="text-stone-500 text-[11px]">Unverified Impression</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-medium text-charcoal mb-1">
                    {inspectingReview.title}
                  </h4>
                  <p className="text-muted-taupe leading-relaxed bg-warm-ivory/20 p-3 rounded border border-soft-stone whitespace-pre-wrap">
                    {inspectingReview.body}
                  </p>
                </div>

                {/* Reporter Logs if any */}
                {inspectingReview.reports && inspectingReview.reports.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-[11px] space-y-2">
                    <span className="font-semibold text-red-900 block">
                      ⚠ Patron Reports ({inspectingReview.reports.length})
                    </span>
                    {inspectingReview.reports.map((rep, idx) => (
                      <div key={idx} className="border-t border-red-200/60 pt-1 text-red-800">
                        <span className="uppercase font-semibold text-[10px]">{rep.reason}</span>: {rep.notes || "No notes provided"} ({new Date(rep.reportedAt).toLocaleDateString()})
                      </div>
                    ))}
                  </div>
                )}

                {/* Internal Moderation Note */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                    Internal Atelier Moderation Note (Confidential)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add private reason or context for audit trail..."
                    value={moderationNote}
                    onChange={(e) => setModerationNote(e.target.value)}
                    className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-soft-stone">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(inspectingReview.id, "published", moderationNote)}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs uppercase tracking-wider font-medium hover:bg-emerald-800 transition-colors rounded-sm"
                  >
                    Approve / Publish
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(inspectingReview.id, "rejected", moderationNote)}
                    className="px-4 py-2 bg-red-700 text-white text-xs uppercase tracking-wider font-medium hover:bg-red-800 transition-colors rounded-sm"
                  >
                    Reject
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectingReview(null)}
                  className="px-4 py-2 border border-soft-stone text-xs uppercase tracking-wider text-muted-taupe hover:text-charcoal transition-colors rounded-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={Boolean(deletingId)}
          title="Delete Customer Review"
          message="Are you sure you wish to permanently delete this customer review? It will be completely expunged from the store ledger and ratings calculations."
          confirmLabel="Delete Review"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDeleteReview}
          onCancel={() => setDeletingId(null)}
        />
      </div>
    </AdminLayout>
  );
}
