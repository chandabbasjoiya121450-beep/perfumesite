"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/data/products";
import { analytics } from "@/lib/analytics";

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
}

interface ToastNotification {
  id: string;
  message: string;
  type: "cart" | "wishlist" | "info";
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, sizeOrQuantity?: string | number, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  toast: ToastNotification | null;
  clearToast: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage on client mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("velore_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      const storedWishlist = localStorage.getItem("velore_wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (e) {
      // LocalStorage unavailable
    }
    setIsLoaded(true);
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("velore_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("velore_wishlist", JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, isLoaded]);

  // Clear toast automatically after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, type: "cart" | "wishlist" | "info") => {
    setToast({
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    });
  };

  const clearToast = () => setToast(null);

  const addToCart = (
    product: Product,
    sizeOrQuantity?: string | number,
    quantity = 1
  ) => {
    let selectedSize = product.size;
    let selectedQuantity = quantity;

    if (typeof sizeOrQuantity === "number") {
      selectedQuantity = sizeOrQuantity;
    } else if (typeof sizeOrQuantity === "string") {
      selectedSize = sizeOrQuantity;
    }

    const cartItemId = `${product.id}-${selectedSize}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          product,
          size: selectedSize,
          quantity: selectedQuantity,
        },
      ];
    });

    analytics.addToCart({
      id: product.id,
      name: product.name,
      family: product.family,
      price: product.price,
      size: selectedSize,
      quantity: selectedQuantity,
    });

    showToast(`Added ${product.name} (${selectedSize}) to your Shopping Bag.`, "cart");
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        analytics.removeFromCart({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          size: item.size,
          quantity: item.quantity,
        });
      }
      return prev.filter((item) => item.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed fragrance from your curated wishlist.", "wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved fragrance to your curated wishlist.", "wishlist");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const wishlistCount = wishlist.length;

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        toast,
        clearToast,
        isSearchOpen,
        openSearch,
        closeSearch,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}

      {/* Floating Global Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-charcoal text-warm-ivory text-xs uppercase tracking-wider rounded-btn shadow-modal border border-champagne/40 animate-fade-in"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
          <span>{toast.message}</span>
          <button
            onClick={clearToast}
            className="ml-2 text-stone-400 hover:text-white p-0.5"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
