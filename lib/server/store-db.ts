import fs from "fs";
import path from "path";
import { PRODUCTS, COLLECTIONS, Product, Collection } from "../data/products";
import { SAMPLE_ORDERS, Order } from "../data/orders";

export interface InventoryHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  adjustment: number;
  reason: string;
  timestamp: string;
  adminEmail: string;
}

export interface StoreSettings {
  storeName: string;
  brandTagline: string;
  currency: string;
  supportEmail: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  lowStockThreshold: number;
  announcementActive: boolean;
  announcementText: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  ordersCount: number;
  totalSpend: number;
  tier: string;
}

export type DiscountType = "percentage" | "fixed";
export type CouponStatus = "active" | "inactive" | "scheduled" | "expired";

export interface Coupon {
  id: string;
  code: string; // Uppercase, trimmed, normalized alphanumeric
  name: string; // Internal campaign name
  description?: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 10 for 10% or 50 for $50
  currency: string; // e.g. "USD"
  minSubtotal: number; // Minimum eligible order subtotal
  maxDiscount?: number; // Optional cap on percentage discount amount
  startDate: string; // ISO 8601
  expiryDate: string; // ISO 8601
  usageLimit: number; // Total allowed redemptions (0 = unlimited)
  perCustomerLimit: number; // Max redemptions per customer email (e.g. 1)
  redemptionCount: number;
  eligibleProductIds?: string[]; // IDs or slugs of eligible products
  eligibleCollectionIds?: string[]; // IDs or slugs of eligible collections
  excludedProductIds?: string[]; // Excluded products
  canCombineWithOtherCoupons: boolean;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  couponCode: string;
  orderId: string;
  customerEmail: string;
  customerId?: string;
  discountAmount: number;
  currency: string;
  timestamp: string;
}

export type ReviewStatus = "published" | "pending" | "rejected" | "removed";

export interface ReviewReport {
  id: string;
  reason: "spam" | "abusive" | "irrelevant" | "fake" | "other";
  notes?: string;
  reporterIdentifier: string;
  reportedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  customerEmail: string;
  customerName: string;
  rating: number; // 1 to 5 integer
  title: string;
  body: string;
  verifiedPurchase: boolean;
  helpfulVotes: number;
  voters: string[];
  reports: ReviewReport[];
  status: ReviewStatus;
  moderationNote?: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface StoreDbSchema {
  products: Product[];
  collections: Collection[];
  orders: Order[];
  inventoryHistory: InventoryHistoryEntry[];
  settings: StoreSettings;
  customers: CustomerRecord[];
  coupons: Coupon[];
  couponRedemptions: CouponRedemption[];
  reviews: Review[];
}

const DB_FILE_PATH = path.join(process.cwd(), "data", "store-db.json");

/**
 * Build initial seed state from existing Module 1-13 catalog and orders
 */
function buildInitialDbState(): StoreDbSchema {
  const seededProducts: Product[] = PRODUCTS.map((p, index) => {
    // Generate authentic SKU and realistic luxury inventory count
    const skuCode = p.slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    const isSpecialReserve = index === 3 || index === 7; // e.g. Oud Imperial, Flamme Dor
    const stockQty = isSpecialReserve ? 5 : 25 + (index * 3) % 40; // 5 units creates low-stock alert

    return {
      ...p,
      sku: `VEL-${skuCode}-100`,
      stock: stockQty,
      lowStockThreshold: 10,
      status: "published",
      updatedAt: p.createdAt,
    };
  });

  const seededSettings: StoreSettings = {
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
    lastUpdated: new Date().toISOString(),
    updatedBy: "System Setup",
  };

  const seededCustomers: CustomerRecord[] = [
    {
      id: "cust-01",
      name: "Eleanor Vance",
      email: "eleanor.vance@velore.com",
      phone: "+1 (555) 234-8901",
      registrationDate: "2024-09-01T00:00:00Z",
      ordersCount: 2,
      totalSpend: 1063.8,
      tier: "Grand Connoisseur Reserve",
    },
    {
      id: "cust-02",
      name: "Julian Sterling",
      email: "j.sterling@mayfair.co.uk",
      phone: "+44 20 7946 0912",
      registrationDate: "2025-01-14T00:00:00Z",
      ordersCount: 1,
      totalSpend: 380.0,
      tier: "Private Collector",
    },
  ];

  return {
    products: seededProducts,
    collections: [...COLLECTIONS],
    orders: [...SAMPLE_ORDERS],
    inventoryHistory: [
      {
        id: "inv-init-01",
        productId: "velore-noir-01",
        productName: "VELORÉ NOIR",
        previousStock: 0,
        newStock: 35,
        adjustment: 35,
        reason: "Initial Production Bottling Maturation (Atelier Grasse)",
        timestamp: "2026-09-01T12:00:00Z",
        adminEmail: "atelier@velore.com",
      },
    ],
    settings: seededSettings,
    customers: seededCustomers,
    coupons: buildInitialCoupons(),
    couponRedemptions: buildInitialRedemptions(),
    reviews: buildInitialReviews(),
  };
}

function buildInitialCoupons(): Coupon[] {
  return [
    {
      id: "cpn-velore10",
      code: "VELORE10",
      name: "Artisan Welcome - 10% Privilege",
      description: "Enjoy 10% complimentary savings across our entire perfume catalog on orders of $150 or more.",
      discountType: "percentage",
      discountValue: 10,
      currency: "USD",
      minSubtotal: 150,
      startDate: "2026-01-01T00:00:00Z",
      expiryDate: "2027-12-31T23:59:59Z",
      usageLimit: 500,
      perCustomerLimit: 1,
      redemptionCount: 14,
      canCombineWithOtherCoupons: false,
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "cpn-welcome50",
      code: "WELCOME50",
      name: "Connoisseur Welcome - $50 Off",
      description: "Complimentary $50 atelier deduction on prestige acquisitions over $250.",
      discountType: "fixed",
      discountValue: 50,
      currency: "USD",
      minSubtotal: 250,
      startDate: "2026-01-01T00:00:00Z",
      expiryDate: "2027-12-31T23:59:59Z",
      usageLimit: 250,
      perCustomerLimit: 1,
      redemptionCount: 8,
      canCombineWithOtherCoupons: false,
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "cpn-elite20",
      code: "ELITE20",
      name: "Private Reserve Privilege - 20% Off",
      description: "Exclusive 20% savings on Private Reserve masterpieces and flagship extraits (Veloré Noir & L'Élite), capped at $100.",
      discountType: "percentage",
      discountValue: 20,
      currency: "USD",
      minSubtotal: 200,
      maxDiscount: 100,
      eligibleCollectionIds: ["private-reserve", "best-sellers"],
      eligibleProductIds: ["velore-noir-01", "velore-elite-02"],
      startDate: "2026-01-01T00:00:00Z",
      expiryDate: "2027-12-31T23:59:59Z",
      usageLimit: 100,
      perCustomerLimit: 1,
      redemptionCount: 5,
      canCombineWithOtherCoupons: false,
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "cpn-vipnoir",
      code: "VIPNOIR",
      name: "Signature Noir Dedicated Atelier - $75 Off",
      description: "Dedicated $75 deduction on Veloré Noir extrait flacon.",
      discountType: "fixed",
      discountValue: 75,
      currency: "USD",
      minSubtotal: 250,
      eligibleProductIds: ["velore-noir-01"],
      startDate: "2026-01-01T00:00:00Z",
      expiryDate: "2027-12-31T23:59:59Z",
      usageLimit: 50,
      perCustomerLimit: 1,
      redemptionCount: 3,
      canCombineWithOtherCoupons: false,
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "cpn-expired15",
      code: "EXPIRED15",
      name: "Autumn Equinox Salon - 15% Off (Expired)",
      description: "Seasonal vintage promotion concluded on September 30, 2026.",
      discountType: "percentage",
      discountValue: 15,
      currency: "USD",
      minSubtotal: 100,
      startDate: "2026-08-01T00:00:00Z",
      expiryDate: "2026-09-30T23:59:59Z",
      usageLimit: 50,
      perCustomerLimit: 1,
      redemptionCount: 50,
      canCombineWithOtherCoupons: false,
      status: "expired",
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-10-01T00:00:00Z",
    },
    {
      id: "cpn-inactive25",
      code: "INACTIVE25",
      name: "Winter Solstice Preview (Draft/Inactive)",
      description: "Pre-launch promotion awaiting executive authorization.",
      discountType: "percentage",
      discountValue: 25,
      currency: "USD",
      minSubtotal: 300,
      startDate: "2026-12-01T00:00:00Z",
      expiryDate: "2026-12-31T23:59:59Z",
      usageLimit: 200,
      perCustomerLimit: 1,
      redemptionCount: 0,
      canCombineWithOtherCoupons: false,
      status: "inactive",
      createdAt: "2026-10-15T00:00:00Z",
      updatedAt: "2026-10-15T00:00:00Z",
    },
  ];
}

function buildInitialRedemptions(): CouponRedemption[] {
  return [
    {
      id: "red-001",
      couponId: "cpn-velore10",
      couponCode: "VELORE10",
      orderId: "VEL-892410",
      customerEmail: "client@velore.com",
      discountAmount: 45.6,
      currency: "USD",
      timestamp: "2026-09-15T14:30:00Z",
    },
    {
      id: "red-002",
      couponId: "cpn-welcome50",
      couponCode: "WELCOME50",
      orderId: "VEL-892412",
      customerEmail: "collector@velore.com",
      discountAmount: 50.0,
      currency: "USD",
      timestamp: "2026-09-02T16:15:00Z",
    },
  ];
}

function buildInitialReviews(): Review[] {
  return [
    {
      id: "rev-001",
      productId: "velore-noir-01",
      productSlug: "noir",
      productName: "VELORÉ NOIR",
      customerEmail: "client@velore.com",
      customerName: "Eleanor V.",
      rating: 5,
      title: "An undeniable masterpiece of olfactory depth",
      body: "The opening of black amber and rare saffron immediately captivates. On the skin, the dry-down evolves into a smooth, velvety dark oud and leather that lingers for well over fourteen hours. Unquestionably my signature evening flacon.",
      verifiedPurchase: true,
      helpfulVotes: 12,
      voters: [],
      reports: [],
      status: "published",
      createdAt: "2026-09-20T11:24:00Z",
      publishedAt: "2026-09-20T12:00:00Z",
      updatedAt: "2026-09-20T12:00:00Z",
    },
    {
      id: "rev-002",
      productId: "velore-noir-01",
      productSlug: "noir",
      productName: "VELORÉ NOIR",
      customerEmail: "julian.c@haute-parfum.com",
      customerName: "Julian C.",
      rating: 5,
      title: "Opulent, mysterious and flawlessly blended",
      body: "Veloré Noir represents what contemporary high perfumery should be. The sillage is dignified without being aggressive, leaving an enchanting trail of smoked incense and bourbon vanilla. The flacon presentation is stunning.",
      verifiedPurchase: true,
      helpfulVotes: 8,
      voters: [],
      reports: [],
      status: "published",
      createdAt: "2026-09-28T16:40:00Z",
      publishedAt: "2026-09-28T17:00:00Z",
      updatedAt: "2026-09-28T17:00:00Z",
    },
    {
      id: "rev-003",
      productId: "velore-lumiere-03",
      productSlug: "lumiere",
      productName: "LUMIÈRE D'OR",
      customerEmail: "client@velore.com",
      customerName: "Eleanor V.",
      rating: 5,
      title: "Golden Mediterranean sunlight captured in crystal",
      body: "The neroli and Calabrian bergamot radiate with pure elegance. It transitions seamlessly into creamy solar jasmine and warm golden cedar. Perfect for daytime salons and warm European evenings.",
      verifiedPurchase: true,
      helpfulVotes: 6,
      voters: [],
      reports: [],
      status: "published",
      createdAt: "2026-10-01T09:15:00Z",
      publishedAt: "2026-10-01T09:30:00Z",
      updatedAt: "2026-10-01T09:30:00Z",
    },
    {
      id: "rev-004",
      productId: "velore-oud-04",
      productSlug: "oud-imperial",
      productName: "OUD IMPERIAL",
      customerEmail: "collector@velore.com",
      customerName: "Lord Sterling",
      rating: 5,
      title: "Precious royal Cambodian oud of the highest calibre",
      body: "Having collected rare vintage ouds for over two decades, I was astonished by the purity and resinous complexity of this extraction. Rich, smoky, and devoid of any medicinal harshness. Worth every sovereign.",
      verifiedPurchase: true,
      helpfulVotes: 15,
      voters: [],
      reports: [],
      status: "published",
      createdAt: "2026-10-05T14:20:00Z",
      publishedAt: "2026-10-05T14:45:00Z",
      updatedAt: "2026-10-05T14:45:00Z",
    },
    {
      id: "rev-005",
      productId: "velore-elite-02",
      productSlug: "elite",
      productName: "L'ÉLITE",
      customerEmail: "marcus.k@velore.com",
      customerName: "Marcus K.",
      rating: 4,
      title: "Remarkable longevity and refined iris nuance",
      body: "A very regal and powdery iris accord wrapped in blonde woods. Takes about twenty minutes to truly settle on the pulse points, after which the cedar and white musk project effortlessly.",
      verifiedPurchase: false,
      helpfulVotes: 2,
      voters: [],
      reports: [],
      status: "pending",
      createdAt: "2026-10-16T18:00:00Z",
      updatedAt: "2026-10-16T18:00:00Z",
    },
  ];
}

let inMemoryDb: StoreDbSchema | null = null;

/**
 * Loads the active database from disk, creating the seed file if missing.
 */
export function getStoreDb(): StoreDbSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      inMemoryDb = JSON.parse(raw);
      // Auto-migrate schema if fields missing
      if (!inMemoryDb!.coupons) {
        inMemoryDb!.coupons = buildInitialCoupons();
        saveStoreDb(inMemoryDb!);
      }
      if (!inMemoryDb!.couponRedemptions) {
        inMemoryDb!.couponRedemptions = buildInitialRedemptions();
        saveStoreDb(inMemoryDb!);
      }
      if (!inMemoryDb!.reviews) {
        inMemoryDb!.reviews = buildInitialReviews();
        saveStoreDb(inMemoryDb!);
      }
      return inMemoryDb!;
    }
  } catch (err) {
    console.error("[VELORÉ DB] Failed to read store db file, using seed state:", err);
  }

  inMemoryDb = buildInitialDbState();
  saveStoreDb(inMemoryDb);
  return inMemoryDb;
}

/**
 * Persists the store database to disk atomically.
 */
export function saveStoreDb(db: StoreDbSchema): void {
  inMemoryDb = db;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${DB_FILE_PATH}.tmp.${process.pid}.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE_PATH);
  } catch (err) {
    console.error("[VELORÉ DB] Failed to persist store database:", err);
  }
}

// ============================================================
// PRODUCT DATA ACCESSORS & MUTATORS
// ============================================================

export function getDbProducts(includeDraftsAndArchived: boolean = false): Product[] {
  const db = getStoreDb();
  if (includeDraftsAndArchived) {
    return db.products;
  }
  // Storefront catalog filters out drafts and archived items
  return db.products.filter(
    (p) => (p.status === "published" || !p.status) && p.isAvailable !== false
  );
}

export function getDbProductById(idOrSlug: string): Product | undefined {
  const db = getStoreDb();
  return db.products.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
}

export function createDbProduct(newProductData: Partial<Product>): { success: boolean; product?: Product; error?: string } {
  const db = getStoreDb();

  if (!newProductData.name || !newProductData.name.trim()) {
    return { success: false, error: "Product name is required." };
  }

  const slug = (newProductData.slug || newProductData.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const existingSlug = db.products.find((p) => p.slug === slug);
  if (existingSlug) {
    return { success: false, error: `Product slug '${slug}' is already in use.` };
  }

  const price = Number(newProductData.price);
  if (isNaN(price) || price < 0) {
    return { success: false, error: "Price must be a valid non-negative number." };
  }

  const stock = typeof newProductData.stock === "number" ? Math.max(0, Math.floor(newProductData.stock)) : 20;

  const id = `velore-${slug}-${Date.now().toString(36)}`;
  const product: Product = {
    id,
    slug,
    name: newProductData.name.trim(),
    subtitle: newProductData.subtitle || "Extrait de Parfum Reserve",
    description: newProductData.description || "",
    price,
    compareAtPrice: newProductData.compareAtPrice ? Number(newProductData.compareAtPrice) : undefined,
    currency: "USD",
    sizeMl: newProductData.sizeMl || 100,
    size: newProductData.size || `${newProductData.sizeMl || 100}ml Extrait de Parfum`,
    images: newProductData.images && newProductData.images.length > 0
      ? newProductData.images
      : [newProductData.image || "/images/products/product-noir.jpg"],
    image: newProductData.image || newProductData.images?.[0] || "/images/products/product-noir.jpg",
    imageAlt: newProductData.imageAlt || `VELORÉ ${newProductData.name.trim()} luxury flacon`,
    fragranceFamily: newProductData.fragranceFamily || "woody",
    family: newProductData.family || "Woody",
    topNotes: newProductData.topNotes || ["Bergamot", "Cardamom"],
    heartNotes: newProductData.heartNotes || ["Precious Woods"],
    baseNotes: newProductData.baseNotes || ["Amber", "Musk"],
    notes: newProductData.notes || {
      top: newProductData.topNotes || ["Bergamot", "Cardamom"],
      heart: newProductData.heartNotes || ["Precious Woods"],
      base: newProductData.baseNotes || ["Amber", "Musk"],
    },
    intensity: newProductData.intensity || "Intense",
    longevity: newProductData.longevity || "12+ hours",
    seasonTags: newProductData.seasonTags || ["All Season"],
    occasionTags: newProductData.occasionTags || ["Everyday Signature"],
    collectionIds: newProductData.collectionIds || ["new-arrivals"],
    isFeatured: Boolean(newProductData.isFeatured),
    isNewArrival: newProductData.isNewArrival !== undefined ? Boolean(newProductData.isNewArrival) : true,
    isBestseller: Boolean(newProductData.isBestseller),
    isGift: Boolean(newProductData.isGift),
    isAvailable: newProductData.isAvailable !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sku: newProductData.sku || `VEL-${slug.toUpperCase().slice(0, 8)}-100`,
    stock,
    lowStockThreshold: newProductData.lowStockThreshold || 10,
    status: newProductData.status || "published",
    seoTitle: newProductData.seoTitle || `${newProductData.name.trim()} — Haute Parfumerie | VELORÉ`,
    seoDescription: newProductData.seoDescription || newProductData.description?.slice(0, 155),
  };

  db.products = [product, ...db.products];
  saveStoreDb(db);

  return { success: true, product };
}

export function updateDbProduct(productId: string, updates: Partial<Product>): { success: boolean; product?: Product; error?: string } {
  const db = getStoreDb();
  const index = db.products.findIndex((p) => p.id === productId || p.slug === productId);

  if (index === -1) {
    return { success: false, error: "Product not found." };
  }

  const existing = db.products[index];

  // Validate slug uniqueness if changed
  if (updates.slug && updates.slug !== existing.slug) {
    const conflict = db.products.find((p) => p.slug === updates.slug && p.id !== existing.id);
    if (conflict) {
      return { success: false, error: `Slug '${updates.slug}' is already taken by another product.` };
    }
  }

  // Validate price
  if (updates.price !== undefined) {
    const price = Number(updates.price);
    if (isNaN(price) || price < 0) {
      return { success: false, error: "Price must be a valid non-negative number." };
    }
  }

  // Validate stock
  if (updates.stock !== undefined) {
    const stock = Number(updates.stock);
    if (isNaN(stock) || stock < 0) {
      return { success: false, error: "Stock quantity must be a non-negative integer." };
    }
  }

  const updated: Product = {
    ...existing,
    ...updates,
    id: existing.id, // Preserve immutable ID
    updatedAt: new Date().toISOString(),
  };

  // Keep notes synchronized if topNotes/heartNotes/baseNotes changed
  if (updates.topNotes || updates.heartNotes || updates.baseNotes) {
    updated.notes = {
      top: updates.topNotes || existing.topNotes,
      heart: updates.heartNotes || existing.heartNotes,
      base: updates.baseNotes || existing.baseNotes,
    };
  }

  db.products[index] = updated;
  saveStoreDb(db);

  return { success: true, product: updated };
}

export function deleteOrArchiveDbProduct(productId: string, permanentDelete: boolean = false): { success: boolean; error?: string } {
  const db = getStoreDb();
  const index = db.products.findIndex((p) => p.id === productId || p.slug === productId);

  if (index === -1) {
    return { success: false, error: "Product not found." };
  }

  const product = db.products[index];

  // Check if historical orders reference this product
  const referencedInOrders = db.orders.some((o) =>
    o.items.some((item) => item.productId === product.id || item.slug === product.slug)
  );

  // If referenced in orders, we strictly archive rather than cascade-delete to protect order integrity
  if (referencedInOrders && permanentDelete) {
    // Gracefully fallback to archiving to preserve audit trail
    db.products[index] = {
      ...product,
      status: "archived",
      isAvailable: false,
      updatedAt: new Date().toISOString(),
    };
    saveStoreDb(db);
    return {
      success: true,
      error: "Product has historical purchase orders. It was archived and unpublished rather than permanently deleted to preserve historical order records.",
    };
  }

  if (permanentDelete) {
    db.products.splice(index, 1);
  } else {
    db.products[index] = {
      ...product,
      status: "archived",
      isAvailable: false,
      updatedAt: new Date().toISOString(),
    };
  }

  saveStoreDb(db);
  return { success: true };
}

// ============================================================
// COLLECTION DATA ACCESSORS & MUTATORS
// ============================================================

export function getDbCollections(): Collection[] {
  const db = getStoreDb();
  return db.collections;
}

export function createDbCollection(newCol: Partial<Collection>): { success: boolean; collection?: Collection; error?: string } {
  const db = getStoreDb();

  if (!newCol.title || !newCol.title.trim()) {
    return { success: false, error: "Collection title is required." };
  }

  const slug = (newCol.slug || newCol.title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (db.collections.some((c) => c.slug === slug)) {
    return { success: false, error: `Collection slug '${slug}' is already in use.` };
  }

  const collection: Collection = {
    id: slug,
    slug,
    title: newCol.title.trim(),
    subtitle: newCol.subtitle || "Curated Olfactory Reserve",
    description: newCol.description || "",
    shortDescription: newCol.shortDescription || newCol.description?.slice(0, 100),
    heroImage: newCol.heroImage || "/images/products/collection-unisex.jpg",
    image: newCol.image || newCol.heroImage || "/images/products/collection-unisex.jpg",
    imageAlt: newCol.imageAlt || `VELORÉ ${newCol.title.trim()} Collection`,
    productIds: newCol.productIds || [],
    sortOrder: newCol.sortOrder || db.collections.length + 1,
    isFeatured: newCol.isFeatured !== false,
    seoTitle: newCol.seoTitle || `${newCol.title.trim()} Fragrance Collection — VELORÉ`,
    seoDescription: newCol.seoDescription || newCol.description?.slice(0, 155),
    relatedCollectionSlugs: newCol.relatedCollectionSlugs || ["best-sellers", "new-arrivals"],
  };

  db.collections.push(collection);
  saveStoreDb(db);

  return { success: true, collection };
}

export function updateDbCollection(slugOrId: string, updates: Partial<Collection>): { success: boolean; collection?: Collection; error?: string } {
  const db = getStoreDb();
  const index = db.collections.findIndex((c) => c.slug === slugOrId || c.id === slugOrId);

  if (index === -1) {
    return { success: false, error: "Collection not found." };
  }

  const existing = db.collections[index];
  const updated = {
    ...existing,
    ...updates,
    id: existing.id,
  };

  db.collections[index] = updated;
  saveStoreDb(db);

  return { success: true, collection: updated };
}

export function deleteDbCollection(slugOrId: string): { success: boolean; error?: string } {
  const db = getStoreDb();
  const index = db.collections.findIndex((c) => c.slug === slugOrId || c.id === slugOrId);

  if (index === -1) {
    return { success: false, error: "Collection not found." };
  }

  db.collections.splice(index, 1);
  saveStoreDb(db);

  return { success: true };
}

// ============================================================
// INVENTORY ADJUSTMENT & AUDIT LOGGING
// ============================================================

export function adjustProductInventory(
  productId: string,
  adjustment: number,
  reason: string,
  adminEmail: string
): { success: boolean; product?: Product; error?: string } {
  const db = getStoreDb();
  const index = db.products.findIndex((p) => p.id === productId || p.slug === productId);

  if (index === -1) {
    return { success: false, error: "Product not found." };
  }

  const product = db.products[index];
  const currentStock = product.stock ?? 0;
  const newStock = currentStock + adjustment;

  if (newStock < 0) {
    return { success: false, error: `Cannot reduce stock below zero. Current stock is ${currentStock}.` };
  }

  product.stock = newStock;
  product.updatedAt = new Date().toISOString();

  // Automatically update isAvailable if stock reaches 0
  if (newStock === 0) {
    product.isAvailable = false;
  } else if (newStock > 0 && !product.isAvailable) {
    product.isAvailable = true;
  }

  // Create audit record
  const auditEntry: InventoryHistoryEntry = {
    id: `inv-adj-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    previousStock: currentStock,
    newStock,
    adjustment,
    reason: reason || "Manual Inventory Reconciliation",
    timestamp: new Date().toISOString(),
    adminEmail: adminEmail || "admin@velore.com",
  };

  db.inventoryHistory.unshift(auditEntry);
  saveStoreDb(db);

  return { success: true, product };
}

export function getInventoryHistory(): InventoryHistoryEntry[] {
  const db = getStoreDb();
  return db.inventoryHistory;
}

// ============================================================
// ORDERS & FULFILLMENT STATUS
// ============================================================

export function getDbOrders(): Order[] {
  const db = getStoreDb();
  return db.orders;
}

export function getDbOrderById(orderId: string): Order | undefined {
  const db = getStoreDb();
  return db.orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
}

export function updateDbOrderStatus(
  orderId: string,
  newStatus: "Confirmed" | "Preparing Dispatch" | "In Transit" | "Delivered" | "Cancelled",
  notes?: string
): { success: boolean; order?: Order; error?: string } {
  const db = getStoreDb();
  const order = db.orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  order.status = newStatus as any;
  saveStoreDb(db);

  return { success: true, order };
}

// ============================================================
// CUSTOMERS & SETTINGS
// ============================================================

export function getDbCustomers(): CustomerRecord[] {
  const db = getStoreDb();
  return db.customers;
}

export function getDbSettings(): StoreSettings {
  const db = getStoreDb();
  return db.settings;
}

export function updateDbSettings(newSettings: Partial<StoreSettings>, adminEmail: string): StoreSettings {
  const db = getStoreDb();
  db.settings = {
    ...db.settings,
    ...newSettings,
    lastUpdated: new Date().toISOString(),
    updatedBy: adminEmail || "Administrator",
  };
  saveStoreDb(db);
  return db.settings;
}

// ============================================================
// COUPONS & PROMOTIONAL CAMPAIGNS
// ============================================================

export function getDbCoupons(): Coupon[] {
  const db = getStoreDb();
  const now = new Date().toISOString();
  let changed = false;
  db.coupons.forEach((c) => {
    if (c.status === "active" && c.expiryDate < now) {
      c.status = "expired";
      changed = true;
    } else if (c.status === "scheduled" && c.startDate <= now && c.expiryDate > now) {
      c.status = "active";
      changed = true;
    }
  });
  if (changed) {
    saveStoreDb(db);
  }
  return db.coupons;
}

export function getDbCouponById(id: string): Coupon | undefined {
  const coupons = getDbCoupons();
  return coupons.find((c) => c.id === id);
}

export function getDbCouponByCode(code: string): Coupon | undefined {
  const coupons = getDbCoupons();
  const normalized = code.trim().toUpperCase();
  return coupons.find((c) => c.code.toUpperCase() === normalized);
}

export function createDbCoupon(
  couponData: Omit<Coupon, "id" | "redemptionCount" | "createdAt" | "updatedAt">
): { success: boolean; coupon?: Coupon; error?: string } {
  const db = getStoreDb();
  const normalizedCode = couponData.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");

  if (!normalizedCode || normalizedCode.length < 3) {
    return { success: false, error: "Coupon code must contain at least 3 alphanumeric characters." };
  }

  // Check code uniqueness
  if (db.coupons.some((c) => c.code.toUpperCase() === normalizedCode)) {
    return { success: false, error: `A coupon with code "${normalizedCode}" already exists.` };
  }

  if (couponData.discountValue <= 0) {
    return { success: false, error: "Discount value must be greater than zero." };
  }

  if (couponData.discountType === "percentage" && couponData.discountValue > 100) {
    return { success: false, error: "Percentage discount cannot exceed 100%." };
  }

  if (new Date(couponData.expiryDate) <= new Date(couponData.startDate)) {
    return { success: false, error: "Expiry date must be after start date." };
  }

  const now = new Date().toISOString();
  const newCoupon: Coupon = {
    ...couponData,
    id: `cpn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code: normalizedCode,
    redemptionCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // Determine initial status based on dates
  if (newCoupon.status !== "inactive") {
    if (newCoupon.startDate > now) {
      newCoupon.status = "scheduled";
    } else if (newCoupon.expiryDate < now) {
      newCoupon.status = "expired";
    } else {
      newCoupon.status = "active";
    }
  }

  db.coupons.unshift(newCoupon);
  saveStoreDb(db);

  return { success: true, coupon: newCoupon };
}

export function updateDbCoupon(
  id: string,
  updates: Partial<Coupon>
): { success: boolean; coupon?: Coupon; error?: string } {
  const db = getStoreDb();
  const index = db.coupons.findIndex((c) => c.id === id);

  if (index === -1) {
    return { success: false, error: "Coupon not found." };
  }

  const existing = db.coupons[index];

  if (updates.code) {
    const normalizedCode = updates.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (normalizedCode !== existing.code && db.coupons.some((c) => c.id !== id && c.code.toUpperCase() === normalizedCode)) {
      return { success: false, error: `A coupon with code "${normalizedCode}" already exists.` };
    }
    updates.code = normalizedCode;
  }

  if (updates.discountValue !== undefined && updates.discountValue <= 0) {
    return { success: false, error: "Discount value must be greater than zero." };
  }

  if (
    updates.discountType === "percentage" &&
    updates.discountValue !== undefined &&
    updates.discountValue > 100
  ) {
    return { success: false, error: "Percentage discount cannot exceed 100%." };
  }

  const updated: Coupon = {
    ...existing,
    ...updates,
    id: existing.id,
    redemptionCount: existing.redemptionCount,
    updatedAt: new Date().toISOString(),
  };

  db.coupons[index] = updated;
  saveStoreDb(db);

  return { success: true, coupon: updated };
}

export function deleteDbCoupon(id: string): { success: boolean; error?: string } {
  const db = getStoreDb();
  const index = db.coupons.findIndex((c) => c.id === id);

  if (index === -1) {
    return { success: false, error: "Coupon not found." };
  }

  db.coupons.splice(index, 1);
  saveStoreDb(db);

  return { success: true };
}

export function toggleCouponStatus(id: string): { success: boolean; coupon?: Coupon; error?: string } {
  const db = getStoreDb();
  const coupon = db.coupons.find((c) => c.id === id);

  if (!coupon) {
    return { success: false, error: "Coupon not found." };
  }

  const now = new Date().toISOString();
  if (coupon.status === "inactive") {
    if (coupon.expiryDate < now) {
      coupon.status = "expired";
    } else if (coupon.startDate > now) {
      coupon.status = "scheduled";
    } else {
      coupon.status = "active";
    }
  } else {
    coupon.status = "inactive";
  }

  coupon.updatedAt = now;
  saveStoreDb(db);

  return { success: true, coupon };
}

export interface CouponValidationCartItem {
  id?: string;
  productId: string;
  quantity: number;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: {
    id: string;
    code: string;
    name: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    currency: string;
  };
  discountAmount?: number;
  eligibleSubtotal?: number;
  totalSubtotal?: number;
  error?: string;
}

export function validateCoupon(
  code: string,
  items: CouponValidationCartItem[],
  customerEmail?: string
): CouponValidationResult {
  if (!code || !code.trim()) {
    return { valid: false, error: "Please enter a promotional code." };
  }

  const normalizedCode = code.trim().toUpperCase();
  const coupon = getDbCouponByCode(normalizedCode);

  if (!coupon) {
    return { valid: false, error: "The promotional code entered is invalid or does not exist." };
  }

  if (coupon.status === "inactive") {
    return { valid: false, error: "This promotional campaign is currently inactive." };
  }

  const now = new Date().toISOString();
  if (coupon.startDate > now) {
    return { valid: false, error: "This promotional privilege has not yet commenced." };
  }

  if (coupon.expiryDate < now || coupon.status === "expired") {
    return { valid: false, error: "This promotional privilege has expired." };
  }

  // Check total usage limits
  if (coupon.usageLimit > 0 && coupon.redemptionCount >= coupon.usageLimit) {
    return { valid: false, error: "The redemption allocation for this promotional code has been exhausted." };
  }

  const db = getStoreDb();

  // Check per-customer limit
  if (customerEmail && coupon.perCustomerLimit > 0) {
    const priorRedemptions = (db.couponRedemptions || []).filter(
      (r) =>
        r.couponId === coupon.id &&
        r.customerEmail.trim().toLowerCase() === customerEmail.trim().toLowerCase()
    );
    if (priorRedemptions.length >= coupon.perCustomerLimit) {
      return {
        valid: false,
        error: `You have already redeemed this promotional privilege the maximum allowable times (${coupon.perCustomerLimit}).`,
      };
    }
  }

  if (!items || items.length === 0) {
    return { valid: false, error: "Your shopping bag is empty." };
  }

  // Calculate merchandise subtotal and eligible subtotal against real catalog prices
  let totalSubtotal = 0;
  let eligibleSubtotal = 0;

  for (const item of items) {
    const product = db.products.find((p) => p.id === item.productId || p.slug === item.productId);
    if (!product) continue;

    const unitPrice = product.price;
    const lineTotal = unitPrice * item.quantity;
    totalSubtotal += lineTotal;

    // Check product exclusions
    if (coupon.excludedProductIds?.length) {
      if (
        coupon.excludedProductIds.includes(product.id) ||
        coupon.excludedProductIds.includes(product.slug)
      ) {
        continue;
      }
    }

    // Check product or collection eligibility
    const hasProductFilter = Boolean(coupon.eligibleProductIds && coupon.eligibleProductIds.length > 0);
    const hasCollectionFilter = Boolean(coupon.eligibleCollectionIds && coupon.eligibleCollectionIds.length > 0);

    let isEligible = true;

    if (hasProductFilter) {
      isEligible = Boolean(
        coupon.eligibleProductIds?.includes(product.id) ||
        coupon.eligibleProductIds?.includes(product.slug)
      );
    }

    if (hasCollectionFilter && isEligible) {
      // Find if collections match
      const inCollection = db.collections.some((col) =>
        coupon.eligibleCollectionIds?.includes(col.slug) ||
        coupon.eligibleCollectionIds?.includes(col.id)
      );
      if (!hasProductFilter) {
        isEligible = inCollection;
      }
    }

    if (isEligible) {
      eligibleSubtotal += lineTotal;
    }
  }

  if (eligibleSubtotal === 0) {
    return {
      valid: false,
      error: "This promotional privilege is not applicable to any of the creations currently in your bag.",
    };
  }

  if (coupon.minSubtotal > 0 && eligibleSubtotal < coupon.minSubtotal) {
    return {
      valid: false,
      error: `This promotional privilege requires a minimum eligible bag subtotal of $${coupon.minSubtotal}. Current eligible: $${eligibleSubtotal.toFixed(2)}.`,
    };
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    const raw = (eligibleSubtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      discountAmount = Math.min(raw, coupon.maxDiscount);
    } else {
      discountAmount = raw;
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, eligibleSubtotal);
  }

  discountAmount = Math.min(discountAmount, eligibleSubtotal);
  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      currency: coupon.currency,
    },
    discountAmount,
    eligibleSubtotal,
    totalSubtotal,
  };
}

export function recordCouponRedemption(data: {
  couponId: string;
  orderId: string;
  customerEmail: string;
  discountAmount: number;
  currency: string;
}): { success: boolean; error?: string } {
  const db = getStoreDb();
  const coupon = db.coupons.find((c) => c.id === data.couponId || c.code === data.couponId);

  if (!coupon) {
    return { success: false, error: "Coupon not found for redemption." };
  }

  // Atomic idempotency check: avoid double recording same order
  const alreadyRedeemed = (db.couponRedemptions || []).some(
    (r) => r.orderId === data.orderId && r.couponId === coupon.id
  );
  if (alreadyRedeemed) {
    return { success: true };
  }

  coupon.redemptionCount += 1;
  if (coupon.usageLimit > 0 && coupon.redemptionCount >= coupon.usageLimit) {
    coupon.status = "expired";
  }

  const redemption: CouponRedemption = {
    id: `red-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    couponId: coupon.id,
    couponCode: coupon.code,
    orderId: data.orderId,
    customerEmail: data.customerEmail,
    discountAmount: data.discountAmount,
    currency: data.currency || "USD",
    timestamp: new Date().toISOString(),
  };

  db.couponRedemptions = db.couponRedemptions || [];
  db.couponRedemptions.unshift(redemption);
  saveStoreDb(db);

  return { success: true };
}

export function getDbCouponRedemptions(): CouponRedemption[] {
  const db = getStoreDb();
  return db.couponRedemptions || [];
}

export function getCampaignAnalytics() {
  const db = getStoreDb();
  const coupons = getDbCoupons();
  const redemptions = db.couponRedemptions || [];

  const activeCount = coupons.filter((c) => c.status === "active").length;
  const scheduledCount = coupons.filter((c) => c.status === "scheduled").length;
  const expiredCount = coupons.filter((c) => c.status === "expired").length;
  const inactiveCount = coupons.filter((c) => c.status === "inactive").length;

  const totalDiscountGranted = redemptions.reduce((acc, r) => acc + r.discountAmount, 0);
  const attributedOrdersCount = new Set(redemptions.map((r) => r.orderId)).size;

  return {
    totalCoupons: coupons.length,
    activeCount,
    scheduledCount,
    expiredCount,
    inactiveCount,
    totalRedemptions: redemptions.length,
    totalDiscountGranted,
    attributedOrdersCount,
  };
}

// ============================================================
// CUSTOMER REVIEWS & RATINGS
// ============================================================

export function getDbReviews(filter?: {
  productId?: string;
  status?: string;
  customerEmail?: string;
  isReported?: boolean;
}): Review[] {
  const db = getStoreDb();
  let reviews = [...(db.reviews || [])];

  if (filter?.productId) {
    const prodKey = filter.productId.toLowerCase();
    reviews = reviews.filter(
      (r) => r.productId.toLowerCase() === prodKey || r.productSlug.toLowerCase() === prodKey
    );
  }

  if (filter?.status && filter.status !== "all") {
    reviews = reviews.filter((r) => r.status === filter.status);
  }

  if (filter?.customerEmail) {
    const emailKey = filter.customerEmail.toLowerCase();
    reviews = reviews.filter((r) => r.customerEmail.toLowerCase() === emailKey);
  }

  if (filter?.isReported) {
    reviews = reviews.filter((r) => r.reports && r.reports.length > 0);
  }

  return reviews;
}

export function getDbReviewById(id: string): Review | undefined {
  const db = getStoreDb();
  return (db.reviews || []).find((r) => r.id === id);
}

export function getProductRatingSummary(productIdOrSlug: string): RatingSummary {
  const reviews = getDbReviews({ productId: productIdOrSlug, status: "published" });

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (reviews.length === 0) {
    return {
      average: 0,
      count: 0,
      distribution,
    };
  }

  let totalRating = 0;
  for (const rev of reviews) {
    const r = Math.min(5, Math.max(1, Math.round(rev.rating)));
    distribution[r as keyof typeof distribution] = (distribution[r as keyof typeof distribution] || 0) + 1;
    totalRating += rev.rating;
  }

  const average = Math.round((totalRating / reviews.length) * 10) / 10;

  return {
    average,
    count: reviews.length,
    distribution,
  };
}

export function createDbReview(data: {
  productId: string;
  customerEmail: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
}): { success: boolean; review?: Review; error?: string } {
  const db = getStoreDb();

  const product = db.products.find(
    (p) => p.id === data.productId || p.slug === data.productId
  );
  if (!product) {
    return { success: false, error: "Product not found in our catalog." };
  }

  const rating = Number(data.rating);
  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: "Please select a star rating between 1 and 5." };
  }

  const title = (data.title || "").trim();
  if (title.length < 3 || title.length > 120) {
    return { success: false, error: "Review title must be between 3 and 120 characters." };
  }

  const body = (data.body || "").trim();
  if (body.length < 10 || body.length > 2000) {
    return { success: false, error: "Review text must be between 10 and 2000 characters." };
  }

  const customerEmail = (data.customerEmail || "").trim().toLowerCase();
  if (!customerEmail || !customerEmail.includes("@")) {
    return { success: false, error: "A valid client email address is required." };
  }

  // Duplicate prevention: check if customer already reviewed this product
  const existingReview = (db.reviews || []).find(
    (r) =>
      r.customerEmail.toLowerCase() === customerEmail &&
      (r.productId === product.id || r.productSlug === product.slug) &&
      r.status !== "removed"
  );
  if (existingReview) {
    return {
      success: false,
      error: "You have already submitted an impression for this fragrance creation.",
    };
  }

  // Genuine purchase verification from database order history
  const hasPurchased = (db.orders || []).some(
    (o) =>
      o.customer?.email?.toLowerCase() === customerEmail &&
      o.status !== "Cancelled" &&
      o.items?.some(
        (i) => i.productId === product.id || i.slug === product.slug
      )
  );

  const now = new Date().toISOString();

  // If verified purchase, published directly; unverified goes to pending moderation
  const status: ReviewStatus = hasPurchased ? "published" : "pending";

  const newReview: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    customerEmail,
    customerName: (data.customerName || "Connoisseur Patron").trim(),
    rating,
    title,
    body,
    verifiedPurchase: hasPurchased,
    helpfulVotes: 0,
    voters: [],
    reports: [],
    status,
    createdAt: now,
    publishedAt: status === "published" ? now : undefined,
    updatedAt: now,
  };

  db.reviews = db.reviews || [];
  db.reviews.unshift(newReview);
  saveStoreDb(db);

  return { success: true, review: newReview };
}

export function updateDbReviewStatus(
  id: string,
  status: ReviewStatus,
  moderationNote?: string
): { success: boolean; review?: Review; error?: string } {
  const db = getStoreDb();
  const review = (db.reviews || []).find((r) => r.id === id);

  if (!review) {
    return { success: false, error: "Review not found." };
  }

  review.status = status;
  if (moderationNote !== undefined) {
    review.moderationNote = moderationNote;
  }
  if (status === "published" && !review.publishedAt) {
    review.publishedAt = new Date().toISOString();
  }
  review.updatedAt = new Date().toISOString();

  saveStoreDb(db);

  return { success: true, review };
}

export function deleteDbReview(id: string): { success: boolean; error?: string } {
  const db = getStoreDb();
  const index = (db.reviews || []).findIndex((r) => r.id === id);

  if (index === -1) {
    return { success: false, error: "Review not found." };
  }

  db.reviews.splice(index, 1);
  saveStoreDb(db);

  return { success: true };
}

export function voteHelpfulReview(
  reviewId: string,
  userIdentifier: string
): { success: boolean; helpfulVotes?: number; error?: string } {
  const db = getStoreDb();
  const review = (db.reviews || []).find((r) => r.id === reviewId);

  if (!review) {
    return { success: false, error: "Review not found." };
  }

  const voterId = (userIdentifier || "anonymous").trim().toLowerCase();
  review.voters = review.voters || [];

  if (review.voters.includes(voterId)) {
    return { success: false, error: "You have already voted on this review." };
  }

  review.voters.push(voterId);
  review.helpfulVotes = (review.helpfulVotes || 0) + 1;
  saveStoreDb(db);

  return { success: true, helpfulVotes: review.helpfulVotes };
}

export function reportDbReview(
  reviewId: string,
  reason: "spam" | "abusive" | "irrelevant" | "fake" | "other",
  reporterIdentifier: string,
  notes?: string
): { success: boolean; error?: string } {
  const db = getStoreDb();
  const review = (db.reviews || []).find((r) => r.id === reviewId);

  if (!review) {
    return { success: false, error: "Review not found." };
  }

  const reporterId = (reporterIdentifier || "anonymous").trim().toLowerCase();
  review.reports = review.reports || [];

  if (review.reports.some((r) => r.reporterIdentifier === reporterId)) {
    return { success: false, error: "You have already reported this review." };
  }

  review.reports.push({
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    reason,
    notes,
    reporterIdentifier: reporterId,
    reportedAt: new Date().toISOString(),
  });

  saveStoreDb(db);

  return { success: true };
}
