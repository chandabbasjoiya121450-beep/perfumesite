"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/lib/data/orders";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status transition state
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
          setSelectedStatus(data.order.status);
        } else {
          setError(data.error || "Order not found.");
        }
      } catch (e) {
        setError("Failed to fetch order records.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order || selectedStatus === order.status) return;

    setIsUpdatingStatus(true);
    setUpdateSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
        setUpdateSuccess(data.message || `Fulfillment status changed to ${selectedStatus}.`);
      } else {
        alert(data.error || "Failed to update fulfillment status.");
      }
    } catch (e) {
      alert("Network error updating status.");
    } finally {
      setIsUpdatingStatus(false);
      setTimeout(() => setUpdateSuccess(null), 3500);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Loading Order..."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: "Details" },
        ]}
      >
        <div className="py-16 text-center text-xs text-muted-taupe">
          Retrieving order receipt from central database...
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout
        title="Order Not Found"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: "Not Found" },
        ]}
      >
        <div className="bg-pure-white p-8 rounded-card border border-soft-stone text-center space-y-4 max-w-md mx-auto">
          <p className="text-sm text-red-700">{error || "Order records could not be found."}</p>
          <Link
            href="/admin/orders"
            className="inline-block px-5 py-2.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium"
          >
            Return to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Order ${order.id}`}
      subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} at ${new Date(order.createdAt).toLocaleTimeString()}`}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Orders", href: "/admin/orders" },
        { label: order.id },
      ]}
      actions={
        <Link
          href="/admin/orders"
          className="text-xs uppercase tracking-wider text-muted-taupe hover:text-charcoal transition-colors"
        >
          ← Back to Orders
        </Link>
      }
    >
      <div className="space-y-8">
        {updateSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm">
            {updateSuccess}
          </div>
        )}

        {/* Top Status & Transition Bar */}
        <div className="bg-pure-white rounded-card border border-soft-stone p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-muted-taupe font-semibold">
              Fulfillment Status:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold ${
                order.status === "Delivered"
                  ? "bg-stone-100 text-charcoal border border-soft-stone"
                  : order.status === "In Transit"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : order.status === "Preparing Dispatch"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Authorized Status Transition Form */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-warm-ivory border border-soft-stone px-3 py-2 rounded-sm text-charcoal focus:outline-none focus:border-charcoal font-medium"
              aria-label="Change order status"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing Dispatch">Preparing Dispatch</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              disabled={isUpdatingStatus || selectedStatus === order.status}
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors rounded-sm disabled:opacity-40"
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>

        {/* Two-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Ordered Items (7 cols) */}
          <div className="lg:col-span-7 bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-6">
            <div className="border-b border-soft-stone pb-3">
              <h2 className="font-serif text-lg text-charcoal font-medium">
                Purchased Formulations ({order.items.length})
              </h2>
              <p className="text-[11px] text-muted-taupe">
                Historical snapshot of flacons, bottle sizes, and purchase prices.
              </p>
            </div>

            <div className="divide-y divide-soft-stone/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center gap-4">
                  <div className="relative w-16 h-20 bg-soft-stone/30 rounded overflow-hidden shrink-0 border border-soft-stone">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      target="_blank"
                      className="font-serif text-base text-charcoal hover:text-champagne font-medium truncate block"
                    >
                      {item.name} ↗
                    </Link>
                    <span className="text-xs text-muted-taupe block mt-0.5">
                      {item.size} &bull; SKU: {item.productId}
                    </span>
                    <span className="text-xs text-charcoal font-medium block mt-1">
                      {formatCurrency(item.price)} &times; {item.quantity}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-base font-semibold text-charcoal">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Complimentary Discovery Samples Included */}
            {order.samples && order.samples.length > 0 && (
              <div className="p-4 bg-warm-ivory rounded-sm border border-soft-stone space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-champagne block">
                  Complimentary Discovery Coffret Dispatched
                </span>
                <ul className="list-disc list-inside text-charcoal space-y-1">
                  {order.samples.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gift Note if composer included one */}
            {order.giftNote && (
              <div className="p-4 bg-pure-white border border-champagne/40 rounded-sm text-xs space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-champagne block">
                  Bespoke Parchment Inscription:
                </span>
                <p className="italic text-charcoal font-serif text-sm">
                  &ldquo;{order.giftNote}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Customer & Financial Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Financial Summary */}
            <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-4">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
                Order Financial Ledger
              </h3>

              <div className="space-y-2.5 text-xs text-muted-taupe">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium font-serif text-sm">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                {order.discount ? (
                  <div className="flex justify-between items-center text-green-700">
                    <span>
                      Privilege Savings{" "}
                      {order.couponCode ? (
                        <span className="font-mono text-[10px] bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                          {order.couponCode}
                        </span>
                      ) : null}
                    </span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between items-center">
                  <span>Shipping ({order.shippingMethod?.name || "Standard Courier"})</span>
                  <span className="text-charcoal">
                    {order.shipping === 0 ? "Complimentary" : formatCurrency(order.shipping)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Estimated Tax</span>
                  <span className="text-charcoal">{formatCurrency(order.tax)}</span>
                </div>

                <div className="pt-3 border-t border-soft-stone flex justify-between items-baseline font-semibold text-charcoal">
                  <span className="text-xs uppercase tracking-wider">Total Paid</span>
                  <span className="font-serif text-xl font-semibold">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-soft-stone/80 text-[11px] text-muted-taupe">
                <span>Payment Method: </span>
                <strong className="text-charcoal font-medium">{order.paymentMethod}</strong>
              </div>
            </div>

            {/* Customer & Shipping Destination */}
            <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-4">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
                Client &amp; Destination Details
              </h3>

              <div className="text-xs text-muted-taupe space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-muted-taupe font-semibold">
                    Client Name
                  </span>
                  <span className="text-charcoal font-medium text-sm">
                    {order.customer.firstName} {order.customer.lastName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-muted-taupe font-semibold">
                    Contact Email &bull; Telephone
                  </span>
                  <p className="text-charcoal">{order.customer.email}</p>
                  <p className="text-charcoal">{order.customer.phone}</p>
                </div>

                <div className="pt-2 border-t border-soft-stone">
                  <span className="text-[10px] uppercase tracking-wider block text-muted-taupe font-semibold mb-1">
                    White-Glove Delivery Destination
                  </span>
                  <div className="text-charcoal leading-relaxed">
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-soft-stone text-[11px]">
                  <span className="text-muted-taupe">Delivery Window: </span>
                  <strong className="text-charcoal font-medium">
                    {order.shippingMethod?.estimatedDelivery || "3–5 business days"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
