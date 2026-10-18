"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { Product } from "@/lib/data/products";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product);
        } else {
          setError(data.error || "Product not found.");
        }
      } catch (e: any) {
        setError("Failed to fetch product details.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout
        title="Loading Product..."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products Catalog", href: "/admin/products" },
          { label: "Edit" },
        ]}
      >
        <div className="py-16 text-center text-xs text-muted-taupe">
          Retrieving fragrance records from database...
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout
        title="Product Not Found"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products Catalog", href: "/admin/products" },
          { label: "Not Found" },
        ]}
      >
        <div className="bg-pure-white p-8 rounded-card border border-soft-stone text-center space-y-4 max-w-md mx-auto">
          <p className="text-sm text-red-700">{error || "Product could not be located."}</p>
          <Link
            href="/admin/products"
            className="inline-block px-5 py-2.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium"
          >
            Return to Products Catalog
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit ${product.name}`}
      subtitle={`SKU: ${product.sku || "N/A"} &bull; Last updated: ${new Date(
        product.updatedAt || product.createdAt
      ).toLocaleDateString()}`}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Products Catalog", href: "/admin/products" },
        { label: product.name },
      ]}
      actions={
        <div className="flex items-center gap-3">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="px-3.5 py-2 text-xs uppercase tracking-wider border border-soft-stone hover:border-charcoal text-charcoal rounded transition-colors inline-flex items-center gap-1.5"
          >
            <span>Preview on Store</span>
            <span className="text-[10px]">↗</span>
          </Link>
        </div>
      }
    >
      <ProductForm initialProduct={product} isEditMode={true} />
    </AdminLayout>
  );
}
