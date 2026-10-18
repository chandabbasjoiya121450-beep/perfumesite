/**
 * VELORÉ Haute Parfumerie — Privacy-Conscious E-Commerce Analytics Engine
 * Standardized GA4 / GTM / Luxury E-commerce Event Dispatcher.
 */

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
}

export type AnalyticsEvent =
  | {
      event: "page_view";
      page_path: string;
      page_title: string;
    }
  | {
      event: "view_item";
      currency: "USD";
      value: number;
      items: AnalyticsItem[];
    }
  | {
      event: "view_item_list";
      item_list_id?: string;
      item_list_name: string;
      items: AnalyticsItem[];
    }
  | {
      event: "select_item";
      item_list_name?: string;
      items: AnalyticsItem[];
    }
  | {
      event: "add_to_cart";
      currency: "USD";
      value: number;
      items: AnalyticsItem[];
    }
  | {
      event: "remove_from_cart";
      currency: "USD";
      value: number;
      items: AnalyticsItem[];
    }
  | {
      event: "view_cart";
      currency: "USD";
      value: number;
      items: AnalyticsItem[];
    }
  | {
      event: "begin_checkout";
      currency: "USD";
      value: number;
      coupon?: string;
      items: AnalyticsItem[];
    }
  | {
      event: "apply_coupon";
      coupon_code: string;
      discount_amount: number;
    }
  | {
      event: "purchase";
      transaction_id: string;
      currency: "USD";
      value: number;
      shipping?: number;
      coupon?: string;
      items: AnalyticsItem[];
    }
  | {
      event: "submit_review";
      product_id: string;
      product_name: string;
      rating: number;
      verified_purchase: boolean;
    };

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

/**
 * Dispatches an analytics event to window.dataLayer and local DOM event bus.
 */
export function trackEvent(payload: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  // 1. Push to standard GTM/GA4 dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...payload,
    timestamp: new Date().toISOString(),
  });

  // 2. Dispatch custom DOM event for lightweight clients & test runners
  try {
    const customEvent = new CustomEvent("velore:analytics", {
      detail: payload,
    });
    window.dispatchEvent(customEvent);
  } catch (err) {
    // Non-blocking in headless environments
  }

  // 3. Optional debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Analytics: ${payload.event}]`, payload);
  }
}

// Convenient helper dispatchers
export const analytics = {
  pageView: (path: string, title: string) =>
    trackEvent({
      event: "page_view",
      page_path: path,
      page_title: title,
    }),

  viewItem: (product: { id: string; name: string; family?: string; price: number }) =>
    trackEvent({
      event: "view_item",
      currency: "USD",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.family,
          price: product.price,
          quantity: 1,
        },
      ],
    }),

  addToCart: (item: { id: string; name: string; family?: string; price: number; size?: string; quantity?: number }) =>
    trackEvent({
      event: "add_to_cart",
      currency: "USD",
      value: item.price * (item.quantity || 1),
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.family,
          item_variant: item.size,
          price: item.price,
          quantity: item.quantity || 1,
        },
      ],
    }),

  removeFromCart: (item: { id: string; name: string; price: number; size?: string; quantity?: number }) =>
    trackEvent({
      event: "remove_from_cart",
      currency: "USD",
      value: item.price * (item.quantity || 1),
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_variant: item.size,
          price: item.price,
          quantity: item.quantity || 1,
        },
      ],
    }),

  beginCheckout: (total: number, items: AnalyticsItem[], coupon?: string) =>
    trackEvent({
      event: "begin_checkout",
      currency: "USD",
      value: total,
      coupon,
      items,
    }),

  purchase: (order: {
    id: string;
    total: number;
    shipping?: number;
    coupon?: string;
    items: Array<{ productId: string; name: string; price: number; quantity: number; size?: string }>;
  }) =>
    trackEvent({
      event: "purchase",
      transaction_id: order.id,
      currency: "USD",
      value: order.total,
      shipping: order.shipping,
      coupon: order.coupon,
      items: order.items.map((i) => ({
        item_id: i.productId,
        item_name: i.name,
        item_variant: i.size,
        price: i.price,
        quantity: i.quantity,
      })),
    }),

  submitReview: (product: { id: string; name: string }, rating: number, verified: boolean) =>
    trackEvent({
      event: "submit_review",
      product_id: product.id,
      product_name: product.name,
      rating,
      verified_purchase: verified,
    }),
};
