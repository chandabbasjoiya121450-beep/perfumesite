"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  return (
    <AdminLayout
      title="Create New Fragrance"
      subtitle="Formulate and catalogue a new luxury extrait or eau de parfum into the VELORÉ reserve."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Products Catalog", href: "/admin/products" },
        { label: "New Fragrance" },
      ]}
      actions={
        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-wider text-muted-taupe hover:text-charcoal transition-colors"
        >
          ← Cancel and Return
        </Link>
      }
    >
      <ProductForm isEditMode={false} />
    </AdminLayout>
  );
}
