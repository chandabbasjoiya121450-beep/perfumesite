"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, FragranceFamily } from "@/lib/data/products";

interface ProductFormProps {
  initialProduct?: Product;
  isEditMode?: boolean;
}

const PRESET_IMAGES = [
  { label: "Noir Flacon", url: "/images/products/product-noir.jpg" },
  { label: "Elite Flacon", url: "/images/products/product-elite.jpg" },
  { label: "Lumière Flacon", url: "/images/products/product-lumiere.jpg" },
  { label: "Oud Flacon", url: "/images/products/product-oud01.jpg" },
  { label: "Bois Blanc Flacon", url: "/images/products/product-bois-blanc.jpg" },
  { label: "Velvet Rose Flacon", url: "/images/products/product-velvet-rose.jpg" },
  { label: "Éclat Flacon", url: "/images/products/product-eclat.jpg" },
  { label: "Amber Flacon", url: "/images/products/product-amber07.jpg" },
  { label: "Maison Flacon", url: "/images/products/product-maison.jpg" },
];

export function ProductForm({ initialProduct, isEditMode = false }: ProductFormProps) {
  const router = useRouter();

  // Basic Details
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [sku, setSku] = useState(
    initialProduct?.sku || (initialProduct?.slug ? `VEL-${initialProduct.slug.toUpperCase().slice(0, 8)}-100` : "")
  );
  const [subtitle, setSubtitle] = useState(initialProduct?.subtitle || "Extrait de Parfum Reserve");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [fragranceFamily, setFragranceFamily] = useState<FragranceFamily>(
    initialProduct?.fragranceFamily || "woody"
  );
  const [collectionIds, setCollectionIds] = useState<string[]>(
    initialProduct?.collectionIds || ["new-arrivals"]
  );

  // Pricing
  const [price, setPrice] = useState(initialProduct ? String(initialProduct.price) : "290");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : ""
  );

  // Media
  const [primaryImage, setPrimaryImage] = useState(
    initialProduct?.images?.[0] || initialProduct?.image || PRESET_IMAGES[0].url
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialProduct?.images || [PRESET_IMAGES[0].url]
  );
  const [imageAlt, setImageAlt] = useState(
    initialProduct?.imageAlt || "VELORÉ luxury flacon"
  );
  const [isUploading, setIsUploading] = useState(false);

  // Olfactory Pyramid
  const [topNotesStr, setTopNotesStr] = useState(
    initialProduct?.topNotes?.join(", ") || "Aged Cardamom, Italian Bergamot"
  );
  const [heartNotesStr, setHeartNotesStr] = useState(
    initialProduct?.heartNotes?.join(", ") || "Mysore Sandalwood Heart, French Oak"
  );
  const [baseNotesStr, setBaseNotesStr] = useState(
    initialProduct?.baseNotes?.join(", ") || "Golden Labdanum, Dark Amber, Musk"
  );
  const [intensity, setIntensity] = useState(initialProduct?.intensity || "Extrait Intense");
  const [longevity, setLongevity] = useState(initialProduct?.longevity || "12+ hours");
  const [sizeMl, setSizeMl] = useState(initialProduct ? String(initialProduct.sizeMl) : "100");
  const [size, setSize] = useState(initialProduct?.size || "100ml Extrait de Parfum");
  const [seasonTagsStr, setSeasonTagsStr] = useState(
    initialProduct?.seasonTags?.join(", ") || "Autumn, Winter, All Year"
  );
  const [occasionTagsStr, setOccasionTagsStr] = useState(
    initialProduct?.occasionTags?.join(", ") || "Evening & Occasion, Signature"
  );

  // Inventory & Publishing
  const [stock, setStock] = useState(initialProduct ? String(initialProduct.stock ?? 30) : "30");
  const [lowStockThreshold, setLowStockThreshold] = useState(
    initialProduct?.lowStockThreshold ? String(initialProduct.lowStockThreshold) : "10"
  );
  const [status, setStatus] = useState<"published" | "draft" | "archived">(
    initialProduct?.status || "published"
  );
  const [isAvailable, setIsAvailable] = useState(initialProduct ? initialProduct.isAvailable : true);
  const [isFeatured, setIsFeatured] = useState(Boolean(initialProduct?.isFeatured));
  const [isNewArrival, setIsNewArrival] = useState(
    initialProduct?.isNewArrival !== undefined ? Boolean(initialProduct.isNewArrival) : true
  );
  const [isBestseller, setIsBestseller] = useState(Boolean(initialProduct?.isBestseller));

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialProduct?.seoDescription || "");

  // Form Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-generate slug when name changes (only in create mode)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditMode && (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
      if (!sku) {
        setSku(`VEL-${generated.toUpperCase().slice(0, 8)}-100`);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Image upload failed.");
        setIsUploading(false);
        return;
      }

      setPrimaryImage(data.url);
      if (!galleryImages.includes(data.url)) {
        setGalleryImages([data.url, ...galleryImages]);
      }
    } catch (err: any) {
      setSubmitError("Failed to upload image. Please check format and size.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleCollection = (colId: string) => {
    if (collectionIds.includes(colId)) {
      setCollectionIds(collectionIds.filter((id) => id !== colId));
    } else {
      setCollectionIds([...collectionIds, colId]);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!slug.trim()) newErrors.slug = "Unique URL slug is required.";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a valid positive number.";
    }
    if (compareAtPrice && (isNaN(Number(compareAtPrice)) || Number(compareAtPrice) < 0)) {
      newErrors.compareAtPrice = "Compare at price must be a valid non-negative number.";
    }
    if (stock && (isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock)))) {
      newErrors.stock = "Stock must be a valid non-negative integer.";
    }
    if (!primaryImage) newErrors.primaryImage = "At least one primary product image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (publishStatusOverride?: "published" | "draft") => {
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const topNotes = topNotesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const heartNotes = heartNotesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const baseNotes = baseNotesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const seasonTags = seasonTagsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const occasionTags = occasionTagsStr.split(",").map((s) => s.trim()).filter(Boolean);

    const familyMap: { [key in FragranceFamily]: string } = {
      woody: "Woody",
      floral: "Floral",
      fresh: "Fresh",
      "amber-oriental": "Amber & Oriental",
    };

    const finalStatus = publishStatusOverride || status;

    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      sku: sku.trim() || `VEL-${slug.toUpperCase().slice(0, 8)}-100`,
      subtitle: subtitle.trim(),
      description: description.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      currency: "USD",
      sizeMl: Number(sizeMl) || 100,
      size: size || `${sizeMl || 100}ml Extrait de Parfum`,
      images: galleryImages.length > 0 ? galleryImages : [primaryImage],
      image: primaryImage,
      imageAlt: imageAlt || `VELORÉ ${name.trim()} luxury flacon`,
      fragranceFamily,
      family: familyMap[fragranceFamily] as any,
      topNotes,
      heartNotes,
      baseNotes,
      notes: {
        top: topNotes,
        heart: heartNotes,
        base: baseNotes,
      },
      intensity: intensity as any,
      longevity,
      seasonTags,
      occasionTags,
      collectionIds,
      isFeatured,
      isNewArrival,
      isBestseller,
      isAvailable,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      status: finalStatus,
      seoTitle: seoTitle.trim() || `${name.trim()} — Haute Parfumerie | VELORÉ`,
      seoDescription: seoDescription.trim() || description.slice(0, 155),
    };

    try {
      const url = isEditMode && initialProduct
        ? `/api/admin/products/${initialProduct.id}`
        : "/api/admin/products";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to save product. Please review form inputs.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setSubmitError("Network error attempting to save product.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-4">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
              Basic Product Information
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Fragrance Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. VELORÉ NOIR"
                className={`w-full px-3.5 py-2.5 text-xs border rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal ${
                  errors.name ? "border-red-500" : "border-soft-stone"
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="text-xs text-muted-taupe bg-soft-stone/30 px-2 py-2.5 border border-r-0 border-soft-stone rounded-l-sm">
                    /products/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="noir"
                    className={`flex-1 px-3 py-2.5 text-xs border rounded-r-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal ${
                      errors.slug ? "border-red-500" : "border-soft-stone"
                    }`}
                  />
                </div>
                {errors.slug && <p className="text-[11px] text-red-600 mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  SKU Identifier
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="VEL-NOIR-100"
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Subtitle / Edition
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Extrait de Parfum Reserve"
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Full Editorial Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Compose the sensory narrative of this olfactory masterpiece..."
                className="w-full p-3 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal leading-relaxed"
              />
            </div>
          </div>

          {/* Card 2: Pricing & Specifications */}
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-4">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
              Pricing &amp; Formulation Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Regular Price (USD) *
                </label>
                <div className="flex items-center">
                  <span className="text-xs text-muted-taupe bg-soft-stone/30 px-3 py-2.5 border border-r-0 border-soft-stone rounded-l-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`flex-1 px-3 py-2.5 text-xs border rounded-r-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal ${
                      errors.price ? "border-red-500" : "border-soft-stone"
                    }`}
                  />
                </div>
                {errors.price && <p className="text-[11px] text-red-600 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Compare At / Original Price (Optional)
                </label>
                <div className="flex items-center">
                  <span className="text-xs text-muted-taupe bg-soft-stone/30 px-3 py-2.5 border border-r-0 border-soft-stone rounded-l-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="350"
                    className="flex-1 px-3 py-2.5 text-xs border border-soft-stone rounded-r-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Bottle Size (ml)
                </label>
                <input
                  type="number"
                  value={sizeMl}
                  onChange={(e) => {
                    setSizeMl(e.target.value);
                    setSize(`${e.target.value}ml ${intensity}`);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Concentration
                </label>
                <select
                  value={intensity}
                  onChange={(e) => {
                    setIntensity(e.target.value as any);
                    setSize(`${sizeMl}ml ${e.target.value}`);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                >
                  <option value="Extrait de Parfum">Extrait de Parfum (25-30%)</option>
                  <option value="Extrait Intense">Extrait Intense (35%+)</option>
                  <option value="Eau de Parfum">Eau de Parfum (18-20%)</option>
                  <option value="Subtle">Subtle Skin Scent</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Longevity
                </label>
                <input
                  type="text"
                  value={longevity}
                  onChange={(e) => setLongevity(e.target.value)}
                  placeholder="12+ hours"
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Olfactory Pyramid */}
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-4">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
              Olfactory Pyramid &amp; Botanical Notes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Primary Fragrance Family *
                </label>
                <select
                  value={fragranceFamily}
                  onChange={(e) => setFragranceFamily(e.target.value as FragranceFamily)}
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                >
                  <option value="woody">Woody (Oud, Santal, Cedar)</option>
                  <option value="floral">Floral (Centifolia Rose, Iris, Jasmine)</option>
                  <option value="fresh">Fresh (Bergamot, Neroli, Solar Citrus)</option>
                  <option value="amber-oriental">Amber &amp; Oriental (Labdanum, Vanilla, Benzoin)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Top Accords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={topNotesStr}
                  onChange={(e) => setTopNotesStr(e.target.value)}
                  placeholder="Aged Cardamom, Italian Bergamot"
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Heart Notes (Comma-separated)
                </label>
                <input
                  type="text"
                  value={heartNotesStr}
                  onChange={(e) => setHeartNotesStr(e.target.value)}
                  placeholder="Mysore Sandalwood Heart, French Oak"
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Base Notes (Comma-separated)
                </label>
                <input
                  type="text"
                  value={baseNotesStr}
                  onChange={(e) => setBaseNotesStr(e.target.value)}
                  placeholder="Golden Labdanum, Dark Amber, Musk"
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Season Tags
                </label>
                <input
                  type="text"
                  value={seasonTagsStr}
                  onChange={(e) => setSeasonTagsStr(e.target.value)}
                  placeholder="Autumn, Winter, All Year"
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Occasion Tags
                </label>
                <input
                  type="text"
                  value={occasionTagsStr}
                  onChange={(e) => setOccasionTagsStr(e.target.value)}
                  placeholder="Evening & Occasion, Signature"
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Product Media */}
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-4">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
              Product Photography &amp; Assets
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Primary Image URL *
              </label>
              <input
                type="text"
                value={primaryImage}
                onChange={(e) => setPrimaryImage(e.target.value)}
                placeholder="/images/products/product-noir.jpg"
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal font-mono"
              />
              {errors.primaryImage && (
                <p className="text-[11px] text-red-600 mt-1">{errors.primaryImage}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Upload New Image File (JPG, PNG, WEBP &bull; Max 5MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-xs text-muted-taupe file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:uppercase file:tracking-wider file:font-medium file:bg-charcoal file:text-pure-white hover:file:bg-champagne hover:file:text-charcoal cursor-pointer"
              />
              {isUploading && (
                <span className="text-[11px] text-champagne block mt-1">
                  Uploading image to server asset storage...
                </span>
              )}
            </div>

            {/* Quick Preset Asset Picker */}
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-muted-taupe mb-2 font-medium">
                Or Select From Atelier Image Assets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setPrimaryImage(preset.url)}
                    className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                      primaryImage === preset.url
                        ? "bg-charcoal text-pure-white border-charcoal"
                        : "bg-warm-ivory/50 text-charcoal border-soft-stone hover:border-champagne"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview Box */}
            {primaryImage && (
              <div className="pt-2">
                <span className="block text-[10px] uppercase tracking-wider text-muted-taupe mb-2">
                  Image Preview:
                </span>
                <div className="relative w-28 h-36 rounded bg-soft-stone/30 overflow-hidden border border-soft-stone">
                  <Image
                    src={primaryImage}
                    alt={imageAlt || "Product Preview"}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Publishing Actions */}
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-5 sticky top-24">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-charcoal border-b border-soft-stone pb-3">
              Publishing &amp; Status
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal font-medium text-charcoal"
              >
                <option value="published">Published (Visible in storefront)</option>
                <option value="draft">Draft (Admin eyes only)</option>
                <option value="archived">Archived (Unpublished, orders preserved)</option>
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t border-soft-stone text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="accent-champagne"
                />
                <span className="text-charcoal">Available for purchase</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-champagne"
                />
                <span className="text-charcoal">Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="accent-champagne"
                />
                <span className="text-charcoal">New Arrival release</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="accent-champagne"
                />
                <span className="text-charcoal">Best Seller badge</span>
              </label>
            </div>

            {/* Inventory Controls */}
            <div className="pt-3 border-t border-soft-stone space-y-3">
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-charcoal">
                Inventory Tracking
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-muted-taupe mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                  />
                  {errors.stock && <p className="text-[10px] text-red-600 mt-1">{errors.stock}</p>}
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-muted-taupe mb-1">
                    Low-Stock Alert
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/20 focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>
            </div>

            {/* Assigned Collections */}
            <div className="pt-3 border-t border-soft-stone space-y-2">
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-charcoal">
                Assigned Collections
              </h3>

              <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                {[
                  { id: "new-arrivals", name: "New Arrivals" },
                  { id: "best-sellers", name: "Best Sellers" },
                  { id: "woody", name: "Noble Woody" },
                  { id: "floral", name: "Floral Masterpieces" },
                  { id: "fresh", name: "Fresh & Solar" },
                  { id: "amber-oriental", name: "Amber & Oriental" },
                  { id: "everyday-signature", name: "Everyday Signature" },
                  { id: "evening-occasion", name: "Evening & Occasion" },
                  { id: "gifts", name: "Gifts & Coffrets" },
                ].map((col) => (
                  <label key={col.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectionIds.includes(col.id)}
                      onChange={() => toggleCollection(col.id)}
                      className="accent-champagne"
                    />
                    <span className="text-muted-taupe hover:text-charcoal">{col.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 border-t border-soft-stone space-y-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("published")}
                className="w-full py-3.5 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving Product..." : isEditMode ? "Save Changes" : "Publish to Storefront"}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("draft")}
                className="w-full py-2.5 bg-pure-white border border-soft-stone text-charcoal text-xs uppercase tracking-wider hover:border-charcoal transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>

              <Link
                href="/admin/products"
                className="block text-center text-xs uppercase tracking-wider text-muted-taupe hover:text-charcoal pt-2 transition-colors"
              >
                Cancel and Return
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
