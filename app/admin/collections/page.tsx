"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Collection, Product } from "@/lib/data/products";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("/images/products/collection-unisex.jpg");
  const [assignedProductIds, setAssignedProductIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Dialog
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [colRes, prodRes] = await Promise.all([
        fetch("/api/admin/collections"),
        fetch("/api/admin/products"),
      ]);

      if (colRes.ok) {
        const colData = await colRes.json();
        setCollections(colData.collections || []);
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingCollection(null);
    setTitle("");
    setSlug("");
    setSubtitle("Curated Olfactory Reserve");
    setDescription("");
    setHeroImage("/images/products/collection-unisex.jpg");
    setAssignedProductIds([]);
    setSortOrder(collections.length + 1);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setEditingCollection(col);
    setTitle(col.title);
    setSlug(col.slug);
    setSubtitle(col.subtitle || "");
    setDescription(col.description || "");
    setHeroImage(col.heroImage || col.image || "/images/products/collection-unisex.jpg");
    setAssignedProductIds(col.productIds || []);
    setSortOrder(col.sortOrder || 1);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingCollection && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const toggleProductAssignment = (pId: string) => {
    if (assignedProductIds.includes(pId)) {
      setAssignedProductIds(assignedProductIds.filter((id) => id !== pId));
    } else {
      setAssignedProductIds([...assignedProductIds, pId]);
    }
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setModalError("Collection title is required.");
      return;
    }

    setIsSaving(true);
    setModalError(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      heroImage,
      image: heroImage,
      productIds: assignedProductIds,
      sortOrder: Number(sortOrder) || 1,
    };

    try {
      const url = editingCollection
        ? `/api/admin/collections/${editingCollection.slug || editingCollection.id}`
        : "/api/admin/collections";

      const method = editingCollection ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Failed to save collection.");
        setIsSaving(false);
        return;
      }

      setIsModalOpen(false);
      setFeedbackMsg(`Collection '${title}' saved successfully.`);
      fetchData();
    } catch (err: any) {
      setModalError("Network error attempting to save collection.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleDeleteCollection = async () => {
    if (!deletingCollection) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/collections/${deletingCollection.slug || deletingCollection.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeedbackMsg(`Collection '${deletingCollection.title}' deleted.`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
      setDeletingCollection(null);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <AdminLayout
      title="Curated Collections Management"
      subtitle="Organize perfumes into themed editorial capsules, olfactory families, and gifting collections."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Collections" },
      ]}
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium rounded-sm"
        >
          + New Collection
        </button>
      }
    >
      <div className="space-y-6">
        {feedbackMsg && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm">
            {feedbackMsg}
          </div>
        )}

        <div className="bg-pure-white rounded-card border border-soft-stone shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-ivory/60 border-b border-soft-stone text-muted-taupe uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Collection</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Slug</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Subtitle</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Products</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Order</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-stone/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-taupe">
                      Loading collections from database...
                    </td>
                  </tr>
                ) : collections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-taupe">
                      No collections defined yet.
                    </td>
                  </tr>
                ) : (
                  collections.map((col) => {
                    const assignedCount = col.productIds ? col.productIds.length : 0;

                    return (
                      <tr key={col.id} className="hover:bg-warm-ivory/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-14 bg-soft-stone/30 rounded overflow-hidden shrink-0 border border-soft-stone">
                              <Image
                                src={col.heroImage || col.image || "/images/products/collection-unisex.jpg"}
                                alt={col.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-serif text-sm font-medium text-charcoal block">
                                {col.title}
                              </span>
                              <span className="text-[11px] text-muted-taupe line-clamp-1">
                                {col.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-[11px] text-muted-taupe">
                          /collections/{col.slug}
                        </td>

                        <td className="px-4 py-3.5 text-charcoal text-[11px]">
                          {col.subtitle || "—"}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="bg-warm-ivory border border-soft-stone px-2.5 py-0.5 rounded text-[11px] font-medium text-charcoal">
                            {assignedCount > 0 ? `${assignedCount} fragrances` : "Dynamic Family"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-muted-taupe">
                          {col.sortOrder ?? "—"}
                        </td>

                        <td className="px-5 py-3.5 text-right space-x-2">
                          <Link
                            href={`/collections/${col.slug}`}
                            target="_blank"
                            className="inline-block px-2 py-1 text-[11px] text-muted-taupe hover:text-charcoal transition-colors"
                          >
                            View Live ↗
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(col)}
                            className="inline-block px-2.5 py-1 text-[11px] uppercase tracking-wider bg-warm-ivory border border-soft-stone hover:border-charcoal text-charcoal rounded transition-colors"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingCollection(col)}
                            className="inline-block px-2 py-1 text-[11px] text-muted-taupe hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Collection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 max-w-xl w-full shadow-modal space-y-5">
            <div className="flex items-center justify-between border-b border-soft-stone pb-3">
              <h3 className="font-serif text-xl text-charcoal font-medium">
                {editingCollection ? `Edit Collection: ${editingCollection.title}` : "Create New Collection"}
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
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveCollection} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Amber & Oriental Resins"
                  className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="amber-oriental"
                    className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Golden Resins & Bourbon Vanilla"
                  className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Sumptuous golden labdanum, rare balsamic benzoin, and warm bourbon vanilla..."
                  className="w-full p-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="/images/products/collection-unisex.jpg"
                  className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal font-mono"
                />
              </div>

              {/* Assign Products Checklist */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1.5 font-medium">
                  Assign Products ({assignedProductIds.length} selected)
                </label>
                <div className="max-h-36 overflow-y-auto border border-soft-stone p-2 rounded-sm space-y-1 bg-warm-ivory/10">
                  {products.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                      <input
                        type="checkbox"
                        checked={assignedProductIds.includes(p.id)}
                        onChange={() => toggleProductAssignment(p.id)}
                        className="accent-champagne"
                      />
                      <span className="text-charcoal truncate">{p.name}</span>
                      <span className="text-[10px] text-muted-taupe ml-auto">{p.family}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-soft-stone">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-soft-stone rounded-sm text-xs uppercase tracking-wider hover:bg-soft-stone/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-charcoal text-pure-white rounded-sm text-xs uppercase tracking-widest font-medium hover:bg-champagne hover:text-charcoal transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingCollection)}
        title={`Delete Collection: ${deletingCollection?.title}?`}
        message="Are you sure you wish to remove this collection? Products assigned to this collection will remain safe in the master catalog."
        confirmLabel="Delete Collection"
        isLoading={isDeleting}
        onConfirm={handleDeleteCollection}
        onCancel={() => setDeletingCollection(null)}
      />
    </AdminLayout>
  );
}
