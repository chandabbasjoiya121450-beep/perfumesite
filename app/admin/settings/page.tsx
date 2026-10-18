"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StoreSettings } from "@/lib/server/store-db";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "VELORÉ",
    brandTagline: "Luxury Fragrances. Timeless Identity.",
    currency: "USD",
    supportEmail: "concierge@velore.com",
    freeShippingThreshold: 150,
    standardShippingFee: 0,
    expressShippingFee: 25,
    lowStockThreshold: 10,
    announcementActive: true,
    announcementText: "Complimentary White-Glove Courier & Discovery Vials on All Orders Above $150",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to update store settings.");
        setIsSaving(false);
        return;
      }

      setSettings(data.settings);
      setIsDirty(false);
      setSaveSuccess("Store configuration saved successfully to the central database.");
    } catch (err: any) {
      setSaveError("Network error attempting to save settings.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 3500);
    }
  };

  return (
    <AdminLayout
      title="Store Configuration &amp; Policies"
      subtitle="Configure luxury brand identity, logistics thresholds, low-stock alerts, and client concierge channels."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings" },
      ]}
      actions={
        isDirty ? (
          <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Unsaved Changes Pending
          </span>
        ) : undefined
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {saveSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm">
            {saveSuccess}
          </div>
        )}

        {saveError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
            {saveError}
          </div>
        )}

        {/* Card 1: Brand & Identity */}
        <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
            Brand Identity &amp; Communications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Maison Brand Name
              </label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Storefront Currency
              </label>
              <input
                type="text"
                disabled
                value={`${settings.currency} — United States Dollar ($)`}
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-soft-stone/30 text-muted-taupe cursor-not-allowed"
              />
              <span className="text-[10px] text-muted-taupe mt-1 block">
                Currency is locked to protect historical order ledger consistency.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
              Brand Tagline
            </label>
            <input
              type="text"
              value={settings.brandTagline}
              onChange={(e) => handleChange("brandTagline", e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
              Client Concierge Email
            </label>
            <input
              type="email"
              required
              value={settings.supportEmail}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
            />
          </div>
        </div>

        {/* Card 2: Logistics & Shipping Thresholds */}
        <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
            Logistics &amp; Courier Delivery Policies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Complimentary Shipping Minimum ($)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange("freeShippingThreshold", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
              />
              <span className="text-[10px] text-muted-taupe mt-1 block">
                Orders above this amount receive free white-glove courier.
              </span>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Standard Courier Delivery Fee ($)
              </label>
              <input
                type="number"
                min="0"
                value={settings.standardShippingFee}
                onChange={(e) => handleChange("standardShippingFee", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Priority Express Air Courier Fee ($)
              </label>
              <input
                type="number"
                min="0"
                value={settings.expressShippingFee}
                onChange={(e) => handleChange("expressShippingFee", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Inventory Alerts */}
        <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
            Atelier Inventory &amp; Stock Thresholds
          </h2>

          <div className="max-w-xs">
            <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
              Global Low-Stock Alert Threshold (Units)
            </label>
            <input
              type="number"
              min="1"
              value={settings.lowStockThreshold}
              onChange={(e) => handleChange("lowStockThreshold", Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
            />
            <span className="text-[10px] text-muted-taupe mt-1 block">
              Triggers replenishment warnings on dashboard and inventory table.
            </span>
          </div>
        </div>

        {/* Card 4: Storefront Announcement Bar */}
        <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-soft-stone pb-3">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal">
              Global Storefront Announcement Bar
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => handleChange("announcementActive", e.target.checked)}
                className="accent-champagne"
              />
              <span className="font-medium text-charcoal">Banner Active</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
              Announcement Message
            </label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => handleChange("announcementText", e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal text-charcoal"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          {settings.lastUpdated && (
            <span className="text-[11px] text-muted-taupe">
              Last modified: {new Date(settings.lastUpdated).toLocaleString()} by {settings.updatedBy || "Admin"}
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest font-medium hover:bg-champagne hover:text-charcoal transition-colors disabled:opacity-50 ml-auto"
          >
            {isSaving ? "Persisting Configuration..." : "Save Store Configuration"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
