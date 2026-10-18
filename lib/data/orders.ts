import { Product } from "./products";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    estimatedDelivery: string;
  };
  paymentMethod: string;
  samples: string[];
  giftNote?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  couponCode?: string;
  couponId?: string;
  couponName?: string;
  total: number;
  status: "Confirmed" | "Preparing Dispatch" | "In Transit" | "Delivered" | "Cancelled";
}

const STORAGE_KEY = "velore_orders";

/**
 * Default sample orders for demonstration in Client Account
 */
export const SAMPLE_ORDERS: Order[] = [
  {
    id: "VEL-892410",
    createdAt: "2026-09-15T14:30:00Z",
    customer: {
      email: "client@velore.com",
      firstName: "Eleanor",
      lastName: "Vance",
      phone: "+1 (555) 234-8901",
    },
    shippingAddress: {
      street: "740 Park Avenue",
      apartment: "Penthouse B",
      city: "New York",
      state: "NY",
      postalCode: "10021",
      country: "United States",
    },
    shippingMethod: {
      id: "express",
      name: "Artisan Courier White-Glove Dispatch",
      price: 0,
      estimatedDelivery: "Delivered on September 18, 2026",
    },
    paymentMethod: "Visa ending in •••• 4242",
    samples: ["Santal Précieux (2ml)", "Rose Nocturne (2ml)"],
    giftNote: "For Eleanor, with heartfelt admiration.",
    items: [
      {
        id: "velore-noir-01-100ml",
        productId: "velore-noir-01",
        name: "VELORÉ NOIR",
        slug: "noir",
        size: "100ml Extrait de Parfum",
        price: 320,
        quantity: 1,
        image: "/images/products/product-noir.jpg",
      },
      {
        id: "velore-lumiere-03-100ml",
        productId: "velore-lumiere-03",
        name: "LUMIÈRE D'OR",
        slug: "lumiere",
        size: "100ml Extrait de Parfum",
        price: 285,
        quantity: 1,
        image: "/images/products/product-lumiere.jpg",
      },
    ],
    subtotal: 605,
    shipping: 0,
    tax: 44.75,
    discount: 45.6,
    couponCode: "VELORE10",
    couponName: "Artisan Welcome - 10% Privilege",
    total: 604.15,
    status: "Delivered",
  },
  {
    id: "VEL-731942",
    createdAt: "2026-10-02T10:15:00Z",
    customer: {
      email: "client@velore.com",
      firstName: "Eleanor",
      lastName: "Vance",
      phone: "+1 (555) 234-8901",
    },
    shippingAddress: {
      street: "740 Park Avenue",
      apartment: "Penthouse B",
      city: "New York",
      state: "NY",
      postalCode: "10021",
      country: "United States",
    },
    shippingMethod: {
      id: "express",
      name: "Artisan Courier White-Glove Dispatch",
      price: 0,
      estimatedDelivery: "Delivered on October 05, 2026",
    },
    paymentMethod: "Mastercard ending in •••• 8821",
    samples: ["Fleur Blanche (2ml)", "Cuir Majestic (2ml)"],
    items: [
      {
        id: "velore-oud-04-100ml",
        productId: "velore-oud-04",
        name: "OUD IMPERIAL",
        slug: "oud-imperial",
        size: "100ml Extrait de Parfum",
        price: 380,
        quantity: 1,
        image: "/images/products/product-oud01.jpg",
      },
    ],
    subtotal: 380,
    shipping: 0,
    tax: 30.4,
    discount: 0,
    total: 410.4,
    status: "Delivered",
  },
];

/**
 * Retrieve all orders from localStorage, falling back to seed orders
 */
export function getSavedOrders(): Order[] {
  if (typeof window === "undefined") return SAMPLE_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SAMPLE_ORDERS;
  }
}

/**
 * Retrieve a specific order by ID
 */
export function getOrderById(orderId: string): Order | undefined {
  const orders = getSavedOrders();
  return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
}

/**
 * Save a newly placed order to localStorage
 */
export function saveNewOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const orders = getSavedOrders();
    const updated = [order, ...orders.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save order to localStorage", e);
  }
}
