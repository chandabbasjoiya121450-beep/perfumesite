"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/utils";
import { Order, getSavedOrders } from "@/lib/data/orders";
import {
  UserProfile,
  Address,
  getSavedUserProfile,
  saveUserProfile,
  isUserAuthenticated,
  setUserAuthentication,
} from "@/lib/data/auth";
import { PRODUCTS } from "@/lib/data/products";

export default function AccountPage() {
  const { wishlist, addToCart } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "wishlist" | "reviews">("orders");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);

  // Sign In / Register Form States
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [authEmail, setAuthEmail] = useState("eleanor.vance@velore.com");
  const [authPassword, setAuthPassword] = useState("••••••••••••");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Address Add Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newApartment, setNewApartment] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");

  useEffect(() => {
    setIsAuthenticated(isUserAuthenticated());
    const profile = getSavedUserProfile();
    setUserProfile(profile);
    setOrders(getSavedOrders());

    if (profile?.email) {
      setLoadingReviews(true);
      fetch(`/api/reviews?customerEmail=${encodeURIComponent(profile.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.reviews)) {
            setCustomerReviews(data.reviews);
          }
        })
        .catch((err) => console.error("Error loading account reviews:", err))
        .finally(() => setLoadingReviews(false));
    }
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setUserAuthentication(true);
    setIsAuthenticated(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...getSavedUserProfile(),
      firstName: regFirstName || "Connoisseur",
      lastName: regLastName || "Client",
      email: authEmail,
    };
    saveUserProfile(updated);
    setUserProfile(updated);
    setUserAuthentication(true);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setUserAuthentication(false);
    setIsAuthenticated(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile) {
      saveUserProfile(userProfile);
      setSaveSuccessMsg("Your olfactory profile has been updated in the VELORÉ registry.");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      isDefault: userProfile.addresses.length === 0,
      label: "Secondary Residence",
      street: newStreet,
      apartment: newApartment || undefined,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      country: "United States",
    };
    const updated = {
      ...userProfile,
      addresses: [...userProfile.addresses, newAddr],
    };
    saveUserProfile(updated);
    setUserProfile(updated);
    setShowAddAddress(false);
    setNewStreet("");
    setNewApartment("");
    setNewCity("");
    setNewState("");
    setNewPostalCode("");
  };

  const handleDeleteAddress = (id: string) => {
    if (!userProfile) return;
    const updated = {
      ...userProfile,
      addresses: userProfile.addresses.filter((a) => a.id !== id),
    };
    saveUserProfile(updated);
    setUserProfile(updated);
  };

  const handleSetDefaultAddress = (id: string) => {
    if (!userProfile) return;
    const updated = {
      ...userProfile,
      addresses: userProfile.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    };
    saveUserProfile(updated);
    setUserProfile(updated);
  };

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <StoreLayout>
      <div className="py-10 sm:py-14 md:py-18">
        <Container>
          {/* ==============================================================
           * 1. UNAUTHENTICATED CLIENT VIEW: SIGN IN / REGISTER
           * ============================================================== */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block mb-2">
                  Client Portal
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
                  Private Registry
                </h1>
                <p className="text-xs text-muted-taupe mt-2">
                  Access your bespoke order archives, formulation preferences, and VIP allocations.
                </p>
              </div>

              <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-subtle">
                {/* Tabs */}
                <div className="grid grid-cols-2 border-b border-soft-stone pb-3 mb-6 text-center text-xs uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={`pb-2 transition-colors font-medium ${
                      authMode === "signin"
                        ? "text-charcoal border-b-2 border-charcoal -mb-[13px]"
                        : "text-muted-taupe hover:text-charcoal"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className={`pb-2 transition-colors font-medium ${
                      authMode === "register"
                        ? "text-charcoal border-b-2 border-charcoal -mb-[13px]"
                        : "text-muted-taupe hover:text-charcoal"
                    }`}
                  >
                    Join Registry
                  </button>
                </div>

                {authMode === "signin" ? (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Client Email
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors mt-2"
                    >
                      Access Account
                    </button>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setUserAuthentication(true);
                          setIsAuthenticated(true);
                        }}
                        className="text-xs text-champagne hover:underline uppercase tracking-wider text-[10px]"
                      >
                        ⚡ One-Click Connoisseur Demo Access
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Eleanor"
                          className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Vance"
                          className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors mt-2"
                    >
                      Join Connoisseur Registry
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* ==============================================================
             * 2. AUTHENTICATED CLIENT DASHBOARD
             * ============================================================== */
            <div className="space-y-8">
              {/* Account Header Hero */}
              <div className="bg-pure-white rounded-card p-6 sm:p-8 border border-soft-stone shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/15 text-champagne text-[10px] uppercase tracking-widest font-semibold mb-2">
                    <span>{userProfile?.tier || "Grand Connoisseur"}</span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
                    Welcome back, {userProfile?.firstName || "Connoisseur"}
                  </h1>
                  <p className="text-xs text-muted-taupe mt-1">
                    Client Registry Member since {userProfile?.memberSince || "2024"} &bull; {userProfile?.email}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/shop"
                    className="px-4 py-2.5 bg-warm-ivory border border-soft-stone text-xs uppercase tracking-wider text-charcoal hover:border-champagne transition-colors"
                  >
                    Browse Reserve
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-4 py-2.5 bg-pure-white border border-soft-stone text-xs uppercase tracking-wider text-muted-taupe hover:text-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-soft-stone pb-px overflow-x-auto text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`py-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === "orders"
                      ? "border-charcoal text-charcoal"
                      : "border-transparent text-muted-taupe hover:text-charcoal"
                  }`}
                >
                  Orders &amp; Dispatches ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`py-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === "profile"
                      ? "border-charcoal text-charcoal"
                      : "border-transparent text-muted-taupe hover:text-charcoal"
                  }`}
                >
                  Olfactory Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("addresses")}
                  className={`py-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === "addresses"
                      ? "border-charcoal text-charcoal"
                      : "border-transparent text-muted-taupe hover:text-charcoal"
                  }`}
                >
                  Address Book ({userProfile?.addresses.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("wishlist")}
                  className={`py-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === "wishlist"
                      ? "border-charcoal text-charcoal"
                      : "border-transparent text-muted-taupe hover:text-charcoal"
                  }`}
                >
                  Saved Wishlist ({wishlist.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`py-3 px-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "border-charcoal text-charcoal"
                      : "border-transparent text-muted-taupe hover:text-charcoal"
                  }`}
                >
                  My Impressions ({customerReviews.length})
                </button>
              </div>

              {/* ==============================================================
               * TAB 1: ORDERS & DISPATCHES
               * ============================================================== */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="bg-pure-white p-12 text-center rounded-card border border-soft-stone space-y-4">
                      <p className="text-sm text-muted-taupe">No order archives found in your registry.</p>
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-3 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors"
                      >
                        Explore Fragrance Reserve
                      </Link>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-pure-white rounded-card border border-soft-stone p-6 shadow-subtle space-y-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soft-stone text-xs">
                          <div>
                            <span className="font-mono font-medium text-charcoal text-sm block">
                              {ord.id}
                            </span>
                            <span className="text-muted-taupe text-[11px]">
                              Placed on {new Date(ord.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                                ord.status === "Delivered"
                                  ? "bg-stone-100 text-charcoal border border-soft-stone"
                                  : "bg-green-100 text-green-800 border border-green-200"
                              }`}
                            >
                              {ord.status}
                            </span>
                            <span className="font-serif text-base font-semibold text-charcoal">
                              {formatCurrency(ord.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="relative w-14 h-16 rounded bg-soft-stone/30 overflow-hidden shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/products/${item.slug}`}
                                  className="font-serif text-base text-charcoal hover:text-champagne transition-colors font-medium truncate block"
                                >
                                  {item.name}
                                </Link>
                                <span className="text-xs text-muted-taupe">
                                  {item.size} &bull; Qty: {item.quantity}
                                </span>
                              </div>
                              <span className="font-serif text-sm font-medium text-charcoal">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Actions */}
                        <div className="pt-3 border-t border-soft-stone flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <span className="text-muted-taupe">
                            Shipping to: {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingMethod.name})
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3.5 py-1.5 border border-soft-stone hover:border-charcoal text-charcoal uppercase tracking-wider text-[11px] transition-colors"
                            >
                              View Invoice
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                ord.items.forEach((it) => {
                                  const prod = PRODUCTS.find((p) => p.id === it.productId);
                                  if (prod) addToCart(prod, 1);
                                });
                              }}
                              className="px-3.5 py-1.5 bg-charcoal text-pure-white hover:bg-champagne hover:text-charcoal uppercase tracking-wider text-[11px] transition-colors"
                            >
                              Reorder Selections
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ==============================================================
               * TAB 2: OLFACTORY PROFILE & PREFERENCES
               * ============================================================== */}
              {activeTab === "profile" && userProfile && (
                <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-subtle max-w-2xl">
                  <h3 className="font-serif text-2xl text-charcoal mb-2">
                    Olfactory Identity &amp; Client Profile
                  </h3>
                  <p className="text-xs text-muted-taupe mb-6">
                    Our master perfumers reference these preferences when curating private coffrets and complimentary discovery vials.
                  </p>

                  {saveSuccessMsg && (
                    <div className="p-3 mb-6 bg-green-50 text-green-800 border border-green-200 text-xs rounded">
                      {saveSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={userProfile.firstName}
                          onChange={(e) =>
                            setUserProfile({ ...userProfile, firstName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={userProfile.lastName}
                          onChange={(e) =>
                            setUserProfile({ ...userProfile, lastName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) =>
                            setUserProfile({ ...userProfile, email: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                          Private Telephone
                        </label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) =>
                            setUserProfile({ ...userProfile, phone: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Preferred Fragrance Family
                      </label>
                      <select
                        value={userProfile.favoriteFamily}
                        onChange={(e) =>
                          setUserProfile({ ...userProfile, favoriteFamily: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      >
                        <option value="Woody & Resinous">Woody &amp; Resinous</option>
                        <option value="Fresh, Citrus & Solar">Fresh, Citrus &amp; Solar</option>
                        <option value="Amber & Oriental">Amber &amp; Oriental</option>
                        <option value="Heirloom Floral">Heirloom Floral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Signature Botanical Notes
                      </label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {userProfile.favoriteNotes.map((note, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-warm-ivory border border-soft-stone rounded-sm text-xs text-charcoal"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-charcoal text-pure-white text-xs uppercase tracking-widest font-medium hover:bg-champagne hover:text-charcoal transition-colors"
                      >
                        Save Olfactory Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ==============================================================
               * TAB 3: ADDRESS BOOK
               * ============================================================== */}
              {activeTab === "addresses" && userProfile && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl text-charcoal">Delivery Addresses</h3>
                      <p className="text-xs text-muted-taupe mt-0.5">
                        Saved locations for bespoke courier dispatch and gifting.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="px-4 py-2 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors"
                    >
                      {showAddAddress ? "Cancel" : "+ Add New Address"}
                    </button>
                  </div>

                  {/* Add Address Form */}
                  {showAddAddress && (
                    <form
                      onSubmit={handleAddAddress}
                      className="bg-pure-white rounded-card border border-champagne/60 p-6 shadow-subtle space-y-4 max-w-xl"
                    >
                      <h4 className="text-xs uppercase font-semibold tracking-wider text-charcoal">
                        New Delivery Destination
                      </h4>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          placeholder="e.g. 1000 Fifth Avenue"
                          className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1">
                            Apt, Suite
                          </label>
                          <input
                            type="text"
                            value={newApartment}
                            onChange={(e) => setNewApartment(e.target.value)}
                            placeholder="Apt 4A"
                            className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            placeholder="New York"
                            className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            required
                            value={newState}
                            onChange={(e) => setNewState(e.target.value)}
                            placeholder="NY"
                            className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          required
                          value={newPostalCode}
                          onChange={(e) => setNewPostalCode(e.target.value)}
                          placeholder="10028"
                          className="w-full px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium"
                      >
                        Save Address
                      </button>
                    </form>
                  )}

                  {/* Address List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-pure-white p-6 rounded-card border shadow-subtle space-y-3 relative ${
                          addr.isDefault ? "border-champagne ring-1 ring-champagne" : "border-soft-stone"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne bg-champagne/10 px-2 py-0.5 rounded">
                              Default Destination
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted-taupe leading-relaxed">
                          <p className="text-charcoal font-medium">
                            {userProfile.firstName} {userProfile.lastName}
                          </p>
                          <p>{addr.street}</p>
                          {addr.apartment && <p>{addr.apartment}</p>}
                          <p>
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                          <p>{addr.country}</p>
                        </div>

                        <div className="pt-2 flex items-center gap-3 text-xs border-t border-soft-stone/60">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-champagne hover:underline text-[11px] uppercase tracking-wider"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-muted-taupe hover:text-red-600 text-[11px] uppercase tracking-wider ml-auto"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==============================================================
               * TAB 4: SAVED WISHLIST PREVIEW
               * ============================================================== */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl text-charcoal">Curated Wishlist</h3>
                      <p className="text-xs text-muted-taupe mt-0.5">
                        {wishlist.length} saved {wishlist.length === 1 ? "fragrance" : "fragrances"} in your private archive.
                      </p>
                    </div>

                    <Link
                      href="/wishlist"
                      className="px-4 py-2 border border-soft-stone text-charcoal text-xs uppercase tracking-wider hover:border-charcoal transition-colors"
                    >
                      Open Full Wishlist Page →
                    </Link>
                  </div>

                  {wishlistedProducts.length === 0 ? (
                    <div className="bg-pure-white p-12 text-center rounded-card border border-soft-stone space-y-4">
                      <p className="text-sm text-muted-taupe">You have no saved fragrances in your wishlist.</p>
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-3 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors"
                      >
                        Explore Fragrances
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-pure-white border border-soft-stone rounded-card p-4 flex gap-4 items-center shadow-subtle"
                        >
                          <Link href={`/products/${p.slug}`} className="relative w-16 h-20 bg-soft-stone/30 rounded overflow-hidden shrink-0">
                            <Image
                              src={p.images?.[0] || p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${p.slug}`}>
                              <h4 className="font-serif text-base text-charcoal truncate hover:text-champagne font-medium">
                                {p.name}
                              </h4>
                            </Link>
                            <span className="text-[11px] text-muted-taupe block">
                              {p.family} &bull; ${p.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => addToCart(p, 1)}
                              className="mt-2 text-[10px] uppercase tracking-wider bg-warm-ivory border border-soft-stone px-2.5 py-1 text-charcoal hover:bg-charcoal hover:text-pure-white transition-colors"
                            >
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ==============================================================
               * TAB 5: MY OLFACTORY IMPRESSIONS (REVIEWS)
               * ============================================================== */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-soft-stone pb-4">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
                        My Olfactory Impressions
                      </h2>
                      <p className="text-xs text-muted-taupe mt-1">
                        Fragrance reflections, longevity ratings, and reviews associated with your client account.
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-flex items-center text-xs text-champagne hover:text-charcoal font-medium uppercase tracking-wider transition-colors"
                    >
                      Review Another Creation &rarr;
                    </Link>
                  </div>

                  {loadingReviews ? (
                    <div className="py-12 text-center text-xs text-muted-taupe font-serif">
                      Consulting your archival impressions...
                    </div>
                  ) : customerReviews.length === 0 ? (
                    <div className="bg-pure-white p-12 text-center rounded-card border border-soft-stone space-y-4">
                      <p className="text-sm text-muted-taupe">
                        You have not yet submitted any fragrance impressions under {userProfile?.email}.
                      </p>
                      <p className="text-xs text-muted-taupe/80 max-w-md mx-auto">
                        Share your discerning experience on any flacon detail page to assist fellow patrons in finding their signature scent.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-block px-6 py-3 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors mt-2"
                      >
                        Explore Fragrance Reserve
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {customerReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-pure-white p-6 rounded-card border border-soft-stone space-y-4 hover:border-champagne/40 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-soft-stone/60 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/products/${rev.productSlug || rev.productId}`}
                                  className="font-serif text-lg text-charcoal hover:text-champagne transition-colors font-medium"
                                >
                                  {rev.productName || "VELORÉ Fragrance"}
                                </Link>
                                {rev.verifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded-xs">
                                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Verified Acquisition
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-taupe">
                                Submitted on {new Date(rev.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <span
                                className={`text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold rounded-xs border ${
                                  rev.status === "published"
                                    ? "bg-warm-ivory text-charcoal border-soft-stone"
                                    : rev.status === "pending"
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : "bg-red-50 text-red-800 border-red-200"
                                }`}
                              >
                                {rev.status === "published"
                                  ? "Published"
                                  : rev.status === "pending"
                                  ? "Under Curatorial Review"
                                  : "Archived"}
                              </span>
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 text-champagne text-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star}>
                                {star <= rev.rating ? "★" : "☆"}
                              </span>
                            ))}
                            <span className="text-xs text-charcoal font-medium ml-1">
                              {rev.rating}.0 / 5.0
                            </span>
                          </div>

                          {/* Review Content */}
                          <div>
                            <h4 className="font-serif text-base text-charcoal font-medium">
                              {rev.title}
                            </h4>
                            <p className="text-xs text-charcoal/80 leading-relaxed mt-1 font-sans">
                              {rev.body}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-soft-stone/40 text-[11px] text-muted-taupe">
                            <span>
                              {rev.helpfulVotes || 0} {rev.helpfulVotes === 1 ? "patron found" : "patrons found"} this helpful
                            </span>
                            <Link
                              href={`/products/${rev.productSlug || rev.productId}`}
                              className="text-champagne hover:underline"
                            >
                              View on Product Page &rarr;
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Invoice Modal */}
          {selectedOrder && (
            <div
              className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-modal">
                <div className="flex items-center justify-between border-b border-soft-stone pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block">
                      Artisan Invoice
                    </span>
                    <h3 className="font-serif text-xl text-charcoal">
                      Order {selectedOrder.id}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-muted-taupe hover:text-charcoal rounded-full"
                    aria-label="Close invoice"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs space-y-2 text-muted-taupe">
                  <div className="flex justify-between">
                    <span>Date Placed:</span>
                    <span className="text-charcoal font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-700 font-medium">{selectedOrder.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span className="text-charcoal">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient:</span>
                    <span className="text-charcoal">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-soft-stone pt-3">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-charcoal">
                        {it.name} ({it.size}) × {it.quantity}
                      </span>
                      <span className="font-medium text-charcoal">
                        {formatCurrency(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-soft-stone pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-muted-taupe">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-taupe">
                    <span>Courier Delivery:</span>
                    <span>{selectedOrder.shipping === 0 ? "Complimentary" : formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-charcoal pt-1 border-t border-soft-stone/60">
                    <span>Total Paid:</span>
                    <span className="font-serif text-base">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors"
                >
                  Close Invoice
                </button>
              </div>
            </div>
          )}
        </Container>
      </div>
    </StoreLayout>
  );
}
