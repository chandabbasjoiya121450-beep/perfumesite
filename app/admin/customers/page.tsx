"use client";

import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatCurrency } from "@/lib/utils";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  ordersCount: number;
  totalSpend: number;
  tier: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/admin/customers");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }
    return true;
  });

  return (
    <AdminLayout
      title="Connoisseur Client Directory"
      subtitle="Registry of verified clients, private fragrance collectors, and patrons of VELORÉ."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Customers" },
      ]}
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-pure-white p-4 sm:p-5 rounded-card border border-soft-stone shadow-subtle flex items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by client name or email address..."
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

          <span className="text-xs text-muted-taupe hidden sm:inline">
            Showing {filteredCustomers.length} {filteredCustomers.length === 1 ? "client" : "clients"}
          </span>
        </div>

        {/* Customer Table */}
        <div className="bg-pure-white rounded-card border border-soft-stone shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-ivory/60 border-b border-soft-stone text-muted-taupe uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Client Name</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Contact Email</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Registry Tier</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Registered</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Orders</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-stone/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-taupe">
                      Loading customer directory from registry...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-taupe">
                      No customer accounts match your search.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-warm-ivory/20 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-charcoal">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-warm-ivory border border-soft-stone text-xs flex items-center justify-center font-serif text-charcoal">
                            {c.name.slice(0, 1)}
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-muted-taupe font-mono text-[11px]">
                        {c.email}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-champagne/15 text-champagne border border-champagne/30">
                          {c.tier || "Client Patron"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-muted-taupe text-[11px]">
                        {new Date(c.registrationDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3.5 text-charcoal font-medium">
                        {c.ordersCount} {c.ordersCount === 1 ? "order" : "orders"}
                      </td>

                      <td className="px-5 py-3.5 text-right font-serif text-sm font-semibold text-charcoal">
                        {formatCurrency(c.totalSpend)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 bg-warm-ivory border border-soft-stone rounded-sm text-[11px] text-muted-taupe flex items-center gap-2">
          <svg className="w-4 h-4 text-champagne shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            Client privacy is protected under VELORÉ Data Governance. Authentication tokens, raw credit card credentials, and passwords are never displayed in administrative views.
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}
