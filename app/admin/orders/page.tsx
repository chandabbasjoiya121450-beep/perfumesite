"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/lib/data/orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchEmail = o.customer.email.toLowerCase().includes(q);
      const matchName = `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(q);
      if (!matchId && !matchEmail && !matchName) return false;
    }

    if (statusFilter !== "all" && o.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout
      title="Order Management &amp; Fulfillment"
      subtitle="Track customer orders, review historical receipts, and transition fulfillment dispatches."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Orders" },
      ]}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="bg-pure-white p-4 sm:p-5 rounded-card border border-soft-stone shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by Order ID (VEL-...), client name, or email..."
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

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-warm-ivory/40 border border-soft-stone px-3 py-2 rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
              aria-label="Filter orders by fulfillment status"
            >
              <option value="all">All Fulfillment Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing Dispatch">Preparing Dispatch</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-pure-white rounded-card border border-soft-stone shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-ivory/60 border-b border-soft-stone text-muted-taupe uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Order Reference</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Date</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Client</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Items</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Total</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Payment</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Fulfillment</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-stone/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-taupe">
                      Loading order records from database...
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-muted-taupe">
                      No customer orders match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-warm-ivory/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-medium text-charcoal">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="hover:text-champagne transition-colors"
                        >
                          {ord.id}
                        </Link>
                      </td>

                      <td className="px-4 py-3.5 text-muted-taupe text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-medium text-charcoal block">
                          {ord.customer.firstName} {ord.customer.lastName}
                        </span>
                        <span className="text-[11px] text-muted-taupe block truncate max-w-[150px]">
                          {ord.customer.email}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-muted-taupe">
                        {ord.items.length} {ord.items.length === 1 ? "creation" : "creations"}
                      </td>

                      <td className="px-4 py-3.5 font-serif font-medium text-charcoal text-sm">
                        {formatCurrency(ord.total)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-stone-100 text-charcoal border border-soft-stone">
                          {ord.status === "Cancelled" ? "Refunded" : "Paid"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                            ord.status === "Delivered"
                              ? "bg-stone-100 text-charcoal border border-soft-stone"
                              : ord.status === "In Transit"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : ord.status === "Preparing Dispatch"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : ord.status === "Cancelled"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-3 py-1 text-xs uppercase tracking-wider bg-warm-ivory border border-soft-stone hover:border-charcoal text-charcoal rounded transition-colors"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-5 py-3.5 bg-warm-ivory/40 border-t border-soft-stone flex items-center justify-between text-xs text-muted-taupe">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
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
    </AdminLayout>
  );
}
