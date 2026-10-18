"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Coupon, DiscountType, CouponStatus } from "@/lib/server/store-db";
import { formatCurrency } from "@/lib/utils";

interface CampaignAnalytics {
  totalCoupons: number;
  activeCount: number;
  scheduledCount: number;
  expiredCount: number;
  inactiveCount: number;
  totalRedemptions: number;
  totalDiscountGranted: number;
  attributedOrdersCount: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDiscountType, setFormDiscountType] = useState<DiscountType>("percentage");
  const [formDiscountValue, setFormDiscountValue] = useState<number>(10);
  const [formMinSubtotal, setFormMinSubtotal] = useState<number>(150);
  const [formMaxDiscount, setFormMaxDiscount] = useState<string>("");
  const [formStartDate, setFormStartDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [formExpiryDate, setFormExpiryDate] = useState<string>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [formUsageLimit, setFormUsageLimit] = useState<number>(200);
  const [formPerCustomerLimit, setFormPerCustomerLimit] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<CouponStatus>("active");
  const [formCanCombine, setFormCanCombine] = useState(false);

  // Deletion Dialog
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (res.ok) {
        setCoupons(data.coupons || []);
        setAnalytics(data.analytics || null);
      } else {
        setError(data.error || "Failed to load coupons.");
      }
    } catch (e) {
      setError("Network error while loading promotions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormName("");
    setFormDescription("");
    setFormDiscountType("percentage");
    setFormDiscountValue(15);
    setFormMinSubtotal(150);
    setFormMaxDiscount("");
    setFormStartDate(new Date().toISOString().slice(0, 10));
    setFormExpiryDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setFormUsageLimit(100);
    setFormPerCustomerLimit(1);
    setFormStatus("active");
    setFormCanCombine(false);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setFormCode(c.code);
    setFormName(c.name);
    setFormDescription(c.description || "");
    setFormDiscountType(c.discountType);
    setFormDiscountValue(c.discountValue);
    setFormMinSubtotal(c.minSubtotal || 0);
    setFormMaxDiscount(c.maxDiscount ? String(c.maxDiscount) : "");
    setFormStartDate(c.startDate.slice(0, 10));
    setFormExpiryDate(c.expiryDate.slice(0, 10));
    setFormUsageLimit(c.usageLimit || 0);
    setFormPerCustomerLimit(c.perCustomerLimit || 1);
    setFormStatus(c.status);
    setFormCanCombine(c.canCombineWithOtherCoupons);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setModalError(null);

    const payload = {
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      description: formDescription.trim(),
      discountType: formDiscountType,
      discountValue: Number(formDiscountValue),
      currency: "USD",
      minSubtotal: Number(formMinSubtotal) || 0,
      maxDiscount: formMaxDiscount ? Number(formMaxDiscount) : undefined,
      startDate: new Date(formStartDate).toISOString(),
      expiryDate: new Date(`${formExpiryDate}T23:59:59Z`).toISOString(),
      usageLimit: Number(formUsageLimit) || 0,
      perCustomerLimit: Number(formPerCustomerLimit) || 1,
      status: formStatus,
      canCombineWithOtherCoupons: formCanCombine,
    };

    try {
      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : "/api/admin/coupons";
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        setModalError(data.error || "Failed to save coupon.");
      }
    } catch (e) {
      setModalError("Network failure while submitting campaign.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (c: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle" }),
      });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (e) {
      console.error("Failed to toggle status", e);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${deletingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingId(null);
        fetchCoupons();
      }
    } catch (e) {
      console.error("Failed to delete coupon", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="Promotional Campaigns & Coupons"
      subtitle="Privilege management, verified order redemptions, and schedule controls."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Coupons & Offers" },
      ]}
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-charcoal text-warm-ivory text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors rounded-sm shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Campaign</span>
        </button>
      }
    >
      <div className="space-y-8 max-w-7xl mx-auto">

        {/* Executive Analytics Metrics */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Active Promotions
              </span>
              <span className="font-serif text-3xl font-medium text-charcoal mt-1 block">
                {analytics.activeCount}
              </span>
              <span className="text-[11px] text-green-700 mt-1 block">
                {analytics.scheduledCount} scheduled upcoming
              </span>
            </div>

            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Total Redemptions
              </span>
              <span className="font-serif text-3xl font-medium text-charcoal mt-1 block">
                {analytics.totalRedemptions}
              </span>
              <span className="text-[11px] text-muted-taupe mt-1 block">
                across verified client orders
              </span>
            </div>

            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Discount Granted
              </span>
              <span className="font-serif text-3xl font-medium text-charcoal mt-1 block">
                {formatCurrency(analytics.totalDiscountGranted)}
              </span>
              <span className="text-[11px] text-muted-taupe mt-1 block">
                lifetime promotional deductions
              </span>
            </div>

            <div className="bg-pure-white p-5 rounded-card border border-soft-stone shadow-subtle">
              <span className="text-[10px] uppercase tracking-wider text-muted-taupe block">
                Attributed Orders
              </span>
              <span className="font-serif text-3xl font-medium text-charcoal mt-1 block">
                {analytics.attributedOrdersCount}
              </span>
              <span className="text-[11px] text-muted-taupe mt-1 block">
                orders placed with coupons
              </span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-pure-white p-4 rounded-card border border-soft-stone shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {["all", "active", "scheduled", "expired", "inactive"].map((tab) => (
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search code or campaign..."
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

        {/* Coupons Table */}
        <div className="bg-pure-white rounded-card border border-soft-stone shadow-subtle overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center text-xs uppercase tracking-widest text-muted-taupe">
              Loading promotional campaigns...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-xs text-red-600">{error}</div>
          ) : filteredCoupons.length === 0 ? (
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <p className="text-sm font-medium text-charcoal">No promotional campaigns found</p>
              <p className="text-xs text-muted-taupe">
                Try modifying your search or click &quot;Create Campaign&quot; to add a new privilege.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-soft-stone bg-warm-ivory/40 uppercase tracking-widest text-[10px] text-muted-taupe font-semibold">
                    <th className="py-3.5 px-4">Coupon Code</th>
                    <th className="py-3.5 px-4">Campaign Title</th>
                    <th className="py-3.5 px-4">Discount</th>
                    <th className="py-3.5 px-4">Min. Spend</th>
                    <th className="py-3.5 px-4">Valid Period</th>
                    <th className="py-3.5 px-4">Redemptions</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-stone/60">
                  {filteredCoupons.map((c) => {
                    const usagePercent =
                      c.usageLimit > 0
                        ? Math.min(100, (c.redemptionCount / c.usageLimit) * 100)
                        : 0;

                    return (
                      <tr key={c.id} className="hover:bg-warm-ivory/20 transition-colors">
                        {/* Code */}
                        <td className="py-4 px-4 font-mono font-medium text-charcoal">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 bg-warm-ivory border border-soft-stone rounded text-xs tracking-wider">
                              {c.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(c.code)}
                              title="Copy code"
                              className="text-muted-taupe hover:text-charcoal p-1"
                            >
                              {copiedCode === c.code ? (
                                <span className="text-[10px] text-green-700 font-sans">Copied</span>
                              ) : (
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Title & Desc */}
                        <td className="py-4 px-4">
                          <p className="font-medium text-charcoal">{c.name}</p>
                          {c.description && (
                            <p className="text-[11px] text-muted-taupe line-clamp-1 max-w-xs">
                              {c.description}
                            </p>
                          )}
                        </td>

                        {/* Discount */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-charcoal">
                            {c.discountType === "percentage"
                              ? `${c.discountValue}% Off`
                              : `${formatCurrency(c.discountValue)} Off`}
                          </span>
                          {c.maxDiscount && (
                            <span className="block text-[10px] text-muted-taupe">
                              Cap: {formatCurrency(c.maxDiscount)}
                            </span>
                          )}
                        </td>

                        {/* Min Spend */}
                        <td className="py-4 px-4 text-muted-taupe font-medium">
                          {c.minSubtotal > 0 ? formatCurrency(c.minSubtotal) : "No Min."}
                        </td>

                        {/* Validity Dates */}
                        <td className="py-4 px-4 text-muted-taupe">
                          <span className="block text-[11px]">
                            {new Date(c.startDate).toLocaleDateString()}
                          </span>
                          <span className="block text-[10px] text-stone-400">
                            to {new Date(c.expiryDate).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Redemptions Progress */}
                        <td className="py-4 px-4 min-w-[130px]">
                          <div className="flex items-center justify-between text-[11px] text-charcoal mb-1">
                            <span>{c.redemptionCount}</span>
                            <span className="text-muted-taupe">
                              {c.usageLimit > 0 ? `/ ${c.usageLimit}` : "(Unlimited)"}
                            </span>
                          </div>
                          {c.usageLimit > 0 && (
                            <div className="w-full h-1.5 bg-soft-stone/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  usagePercent >= 90 ? "bg-amber-600" : "bg-champagne"
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                              c.status === "active"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : c.status === "scheduled"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : c.status === "expired"
                                ? "bg-stone-100 text-stone-600 border border-stone-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            title={c.status === "active" ? "Deactivate" : "Activate"}
                            className="text-muted-taupe hover:text-charcoal text-[11px] uppercase tracking-wider underline transition-colors"
                          >
                            {c.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <span className="text-soft-stone">&bull;</span>
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="text-muted-taupe hover:text-charcoal text-[11px] uppercase tracking-wider underline transition-colors"
                          >
                            Edit
                          </button>
                          <span className="text-soft-stone">&bull;</span>
                          <button
                            type="button"
                            onClick={() => setDeletingId(c.id)}
                            className="text-muted-taupe hover:text-red-700 text-[11px] uppercase tracking-wider underline transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-pure-white rounded-card border border-soft-stone max-w-2xl w-full p-6 sm:p-8 shadow-modal space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-soft-stone">
                <h3 className="font-serif text-2xl font-medium text-charcoal">
                  {editingCoupon ? `Edit Campaign: ${editingCoupon.code}` : "Create New Campaign"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-muted-taupe hover:text-charcoal"
                >
                  ✕
                </button>
              </div>

              {modalError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Code */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Promotional Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AUTUMN15"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm uppercase tracking-wider font-mono text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>

                  {/* Campaign Name */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Connoisseur Equinox Salon"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the promotional terms for internal catalog clarity..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Discount Type */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Discount Type
                    </label>
                    <select
                      value={formDiscountType}
                      onChange={(e) => setFormDiscountType(e.target.value as DiscountType)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal focus:outline-none focus:border-charcoal"
                    >
                      <option value="percentage">Percentage (%) Off</option>
                      <option value="fixed">Fixed Deduction ($) Off</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={formDiscountType === "percentage" ? 100 : 10000}
                      value={formDiscountValue}
                      onChange={(e) => setFormDiscountValue(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>

                  {/* Max Discount (Cap) */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Max Discount Cap ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Optional"
                      value={formMaxDiscount}
                      onChange={(e) => setFormMaxDiscount(e.target.value)}
                      disabled={formDiscountType !== "percentage"}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Minimum Subtotal */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Min Eligible Subtotal ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formMinSubtotal}
                      onChange={(e) => setFormMinSubtotal(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>

                  {/* Total Usage Limit */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Total Usage Limit (0 = Unlimited)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formUsageLimit}
                      onChange={(e) => setFormUsageLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formExpiryDate}
                      onChange={(e) => setFormExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Per Customer Limit */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Per-Customer Redemption Limit
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formPerCustomerLimit}
                      onChange={(e) => setFormPerCustomerLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm text-charcoal focus:outline-none focus:border-charcoal bg-warm-ivory/20"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Campaign Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as CouponStatus)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal focus:outline-none focus:border-charcoal"
                    >
                      <option value="active">Active (Available)</option>
                      <option value="inactive">Inactive (Paused/Draft)</option>
                      <option value="scheduled">Scheduled (Future)</option>
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-soft-stone">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-soft-stone text-xs uppercase tracking-wider text-muted-taupe hover:text-charcoal transition-colors rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-charcoal text-warm-ivory text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors rounded-sm disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : editingCoupon ? "Update Campaign" : "Publish Campaign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={Boolean(deletingId)}
          title="Delete Promotional Campaign"
          message="Are you sure you wish to permanently remove this promotional coupon campaign? Historical customer order records that redeemed this code will preserve their granted discounts intact."
          confirmLabel="Delete Campaign"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDeleteCoupon}
          onCancel={() => setDeletingId(null)}
        />
      </div>
    </AdminLayout>
  );
}
