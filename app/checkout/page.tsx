"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/lib/utils";
import { Order, OrderItem, saveNewOrder } from "@/lib/data/orders";
import { Container } from "@/components/ui/Container";
import { analytics } from "@/lib/analytics";

const SAMPLE_OPTIONS = [
  "Santal Précieux (2ml Extrait)",
  "Rose Nocturne (2ml Extrait)",
  "Lumière d'Or (2ml Extrait)",
  "Fleur Blanche (2ml Eau de Parfum)",
  "Cuir Majestic (2ml Extrait)",
  "Ambre Impérial (2ml Extrait)",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartCount, clearCart } = useStore();

  // Contact & Shipping Form
  const [email, setEmail] = useState("connoisseur@velore.com");
  const [phone, setPhone] = useState("+1 (555) 789-0123");
  const [firstName, setFirstName] = useState("Eleanor");
  const [lastName, setLastName] = useState("Vance");
  const [street, setStreet] = useState("740 Park Avenue");
  const [apartment, setApartment] = useState("Penthouse B");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("NY");
  const [postalCode, setPostalCode] = useState("10021");
  const [country, setCountry] = useState("United States");

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Selected Samples (max 2)
  const [selectedSamples, setSelectedSamples] = useState<string[]>([
    SAMPLE_OPTIONS[0],
    SAMPLE_OPTIONS[1],
  ]);

  // Payment Form (Demo Mode)
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("888");
  const [cardName, setCardName] = useState("Eleanor Vance");

  // Promo Code
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoCouponInfo, setPromoCouponInfo] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const shippingCost = shippingMethod === "express" ? 25 : 0;
  const tax = Math.round(Math.max(0, cartSubtotal - promoDiscount) * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, cartSubtotal - promoDiscount + shippingCost + tax);

  const validateCheckoutCoupon = async (codeToTest: string) => {
    if (!codeToTest.trim()) {
      setPromoMessage({ type: "error", text: "Please enter a promotional code." });
      return;
    }

    setPromoLoading(true);
    setPromoMessage(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToTest.trim(),
          items: cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })),
          customerEmail: email,
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setPromoDiscount(data.discountAmount);
        setPromoApplied(true);
        setPromoCouponInfo(data.coupon);
        setPromoMessage({
          type: "success",
          text: `${data.coupon.name} applied successfully.`,
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("velore_applied_coupon", codeToTest.trim().toUpperCase());
        }
      } else {
        setPromoDiscount(0);
        setPromoApplied(false);
        setPromoCouponInfo(null);
        setPromoMessage({
          type: "error",
          text: data.error || "The promotional code entered is not valid.",
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("velore_applied_coupon");
        }
      }
    } catch (e) {
      setPromoMessage({ type: "error", text: "Failed to validate promotional code." });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    validateCheckoutCoupon(promoCode);
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCouponInfo(null);
    setPromoMessage(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("velore_applied_coupon");
    }
  };

  // Restore coupon from session/localStorage if available
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("velore_applied_coupon") : null;
    if (saved && cart.length > 0 && !promoApplied) {
      setPromoCode(saved);
      validateCheckoutCoupon(saved);
    }
  }, [cartSubtotal]);

  // Track checkout initiation
  useEffect(() => {
    if (cart.length > 0) {
      analytics.beginCheckout(
        cartSubtotal,
        cart.map((c) => ({
          item_id: c.product.id,
          item_name: c.product.name,
          item_category: c.product.family,
          item_variant: c.size,
          price: c.product.price,
          quantity: c.quantity,
        })),
        promoApplied ? promoCode : undefined
      );
    }
  }, []);

  const toggleSample = (sampleName: string) => {
    if (selectedSamples.includes(sampleName)) {
      setSelectedSamples(selectedSamples.filter((s) => s !== sampleName));
    } else {
      if (selectedSamples.length < 2) {
        setSelectedSamples([...selectedSamples, sampleName]);
      } else {
        setSelectedSamples([selectedSamples[1], sampleName]);
      }
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const orderId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderItems: OrderItem[] = cart.map((c) => ({
      id: c.id,
      productId: c.product.id,
      name: c.product.name,
      slug: c.product.slug,
      size: c.size || c.product.size,
      price: c.product.price,
      quantity: c.quantity,
      image: c.product.images?.[0] || c.product.image,
    }));

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        email,
        firstName,
        lastName,
        phone,
      },
      shippingAddress: {
        street,
        apartment,
        city,
        state,
        postalCode,
        country,
      },
      shippingMethod: {
        id: shippingMethod,
        name:
          shippingMethod === "express"
            ? "Priority Express Air Courier"
            : "Artisan Complimentary Courier Dispatch",
        price: shippingCost,
        estimatedDelivery:
          shippingMethod === "express" ? "1–2 business days" : "3–5 business days",
      },
      paymentMethod: `Demo Card (ending in ${cardNumber.slice(-4)})`,
      samples: selectedSamples,
      items: orderItems,
      subtotal: cartSubtotal,
      shipping: shippingCost,
      tax,
      discount: promoDiscount,
      couponCode: promoApplied ? promoCode.trim().toUpperCase() : undefined,
      total: grandTotal,
      status: "Preparing Dispatch",
    };

    try {
      // POST to backend API for verified catalog checkout & redemption tracking
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        // Save confirmed order snapshot locally for customer account view
        saveNewOrder(data.order);
        analytics.purchase({
          id: data.order.id,
          total: data.order.total,
          shipping: data.order.shipping,
          coupon: data.order.couponCode,
          items: data.order.items,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("velore_applied_coupon");
        }
        clearCart();
        router.push(`/checkout/success/${data.order.id}`);
      } else {
        setSubmissionError(
          data.error || "Order validation failed. Please review your bag and try again."
        );
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Order submission failure:", err);
      // Fallback to client order saving in event of network issue
      saveNewOrder(newOrder);
      if (typeof window !== "undefined") {
        localStorage.removeItem("velore_applied_coupon");
      }
      clearCart();
      router.push(`/checkout/success/${orderId}`);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-warm-ivory flex flex-col justify-center items-center px-4 py-16 text-center">
        <Link href="/" className="mb-8">
          <span className="font-serif text-3xl font-medium tracking-wordmark text-charcoal">
            VELORÉ
          </span>
          <span className="block text-[9px] uppercase tracking-widest text-champagne">
            Haute Parfumerie
          </span>
        </Link>

        <div className="bg-pure-white p-8 rounded-card border border-soft-stone max-w-md w-full shadow-subtle space-y-4">
          <h1 className="font-serif text-2xl text-charcoal">Your Bag Is Empty</h1>
          <p className="text-xs text-muted-taupe leading-relaxed">
            Please add your desired perfume creations to your shopping bag before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block w-full py-3 bg-charcoal text-pure-white text-xs uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors font-medium"
          >
            Explore Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory text-charcoal">
      {/* Focused Checkout Header */}
      <header className="border-b border-soft-stone bg-pure-white sticky top-0 z-30">
        <Container>
          <div className="h-18 py-4 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex flex-col items-start">
              <span className="font-serif text-2xl font-medium tracking-wordmark text-charcoal">
                VELORÉ
              </span>
              <span className="text-[8.5px] uppercase tracking-widest text-champagne -mt-1">
                Haute Parfumerie
              </span>
            </Link>

            {/* Security Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-taupe tracking-wider uppercase">
              <svg className="w-4 h-4 text-champagne" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>256-Bit Encrypted Checkout</span>
            </div>

            {/* Back to Cart */}
            <Link
              href="/cart"
              className="text-xs uppercase tracking-wider text-charcoal hover:text-champagne transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Return to Bag</span>
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Checkout Grid */}
      <main className="py-10 sm:py-14">
        <Container>
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 1: Contact Information */}
              <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle space-y-5">
                <div className="flex items-center justify-between border-b border-soft-stone pb-3">
                  <h2 className="font-serif text-lg text-charcoal flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-warm-ivory border border-soft-stone text-xs flex items-center justify-center font-sans">
                      1
                    </span>
                    <span>Contact Information</span>
                  </h2>
                  <span className="text-[11px] text-muted-taupe uppercase">
                    Order notifications
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                      Mobile Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery & Shipping Address */}
              <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle space-y-5">
                <div className="flex items-center justify-between border-b border-soft-stone pb-3">
                  <h2 className="font-serif text-lg text-charcoal flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-warm-ivory border border-soft-stone text-xs flex items-center justify-center font-sans">
                      2
                    </span>
                    <span>Shipping Address</span>
                  </h2>
                  <span className="text-[11px] text-muted-taupe uppercase">
                    White-Glove Courier
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. 740 Park Avenue"
                      className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Apartment, Suite (optional)
                      </label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="Suite 14B"
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Country *
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="France">France</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Delivery Method */}
              <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-soft-stone pb-3">
                  <h2 className="font-serif text-lg text-charcoal flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-warm-ivory border border-soft-stone text-xs flex items-center justify-center font-sans">
                      3
                    </span>
                    <span>Shipping Method</span>
                  </h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`p-4 rounded-card border block cursor-pointer transition-all ${
                      shippingMethod === "standard"
                        ? "border-champagne bg-warm-ivory/40 ring-1 ring-champagne"
                        : "border-soft-stone bg-pure-white hover:border-champagne/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="accent-champagne"
                        />
                        <div>
                          <span className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                            Complimentary Luxury Courier
                          </span>
                          <span className="block text-[11px] text-muted-taupe mt-0.5">
                            Estimated delivery: 3–5 business days in temperature-controlled casing
                          </span>
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                        Free
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-card border block cursor-pointer transition-all ${
                      shippingMethod === "express"
                        ? "border-champagne bg-warm-ivory/40 ring-1 ring-champagne"
                        : "border-soft-stone bg-pure-white hover:border-champagne/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="accent-champagne"
                        />
                        <div>
                          <span className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                            Priority Express Air Courier
                          </span>
                          <span className="block text-[11px] text-muted-taupe mt-0.5">
                            Direct express transit (1–2 business days) with dedicated courier tracking
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-charcoal">
                        $25.00
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 4: Complimentary Sample Discovery Coffret */}
              <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-soft-stone pb-3">
                  <div>
                    <h2 className="font-serif text-lg text-charcoal flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-warm-ivory border border-soft-stone text-xs flex items-center justify-center font-sans">
                        4
                      </span>
                      <span>Complimentary Discovery Vials</span>
                    </h2>
                    <p className="text-[11px] text-muted-taupe mt-1">
                      Select up to 2 miniature extraits (2ml) to accompany your order.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-champagne">
                    {selectedSamples.length}/2 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_OPTIONS.map((sample) => {
                    const isSelected = selectedSamples.includes(sample);

                    return (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => toggleSample(sample)}
                        className={`p-3 text-left rounded-sm border text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? "border-champagne bg-warm-ivory font-medium text-charcoal"
                            : "border-soft-stone bg-pure-white text-muted-taupe hover:border-champagne/60"
                        }`}
                      >
                        <span className="truncate pr-2">{sample}</span>
                        <span className="shrink-0 text-champagne text-xs">
                          {isSelected ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Payment Mode (Clear Demo Simulation) */}
              <div className="bg-pure-white p-6 sm:p-8 rounded-card border border-soft-stone shadow-subtle space-y-5">
                <div className="flex items-center justify-between border-b border-soft-stone pb-3">
                  <div>
                    <h2 className="font-serif text-lg text-charcoal flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-warm-ivory border border-soft-stone text-xs flex items-center justify-center font-sans">
                        5
                      </span>
                      <span>Payment Simulation</span>
                    </h2>
                    <span className="inline-block mt-1 text-[11px] text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                      ⚡ Demo Mode Active — No real charges will be incurred
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                        Security Code (CVV)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs text-muted-taupe">
                    <input
                      type="checkbox"
                      id="sameBilling"
                      defaultChecked
                      className="accent-champagne"
                    />
                    <label htmlFor="sameBilling" className="cursor-pointer">
                      Billing address matches shipping address
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-pure-white rounded-card p-6 sm:p-8 border border-soft-stone shadow-card sticky top-28 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-soft-stone">
                  <h3 className="text-xs uppercase font-semibold tracking-widest text-charcoal">
                    Order Summary
                  </h3>
                  <span className="text-xs text-muted-taupe">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Compact Item List */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-14 h-18 bg-soft-stone/30 rounded overflow-hidden shrink-0">
                        <Image
                          src={item.product.images?.[0] || item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm text-charcoal truncate font-medium">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-muted-taupe block">
                          Qty: {item.quantity} &bull; {item.size || item.product.size}
                        </span>
                      </div>
                      <span className="font-serif text-sm font-medium text-charcoal shrink-0">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Complimentary Samples Summary */}
                {selectedSamples.length > 0 && (
                  <div className="py-3 px-3.5 bg-warm-ivory rounded-sm border border-soft-stone text-xs space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-champagne font-semibold block">
                      Complimentary Sample Discovery Coffret
                    </span>
                    {selectedSamples.map((s, idx) => (
                      <p key={idx} className="text-[11px] text-charcoal">
                        &bull; {s}
                      </p>
                    ))}
                  </div>
                )}

                {/* Promo Code Entry */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={promoApplied || promoLoading}
                      placeholder="Promotional code (VELORE10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs border border-soft-stone rounded-sm bg-warm-ivory/50 focus:outline-none focus:border-charcoal uppercase font-mono disabled:opacity-75"
                    />
                    {promoApplied ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-3 py-2 bg-stone-100 border border-soft-stone text-xs uppercase tracking-wider text-muted-taupe hover:text-red-700 hover:border-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={promoLoading || !promoCode.trim()}
                        onClick={handleApplyPromo}
                        className="px-3 py-2 bg-warm-ivory border border-soft-stone text-xs uppercase tracking-wider text-charcoal hover:bg-charcoal hover:text-pure-white transition-colors disabled:opacity-50"
                      >
                        {promoLoading ? "..." : "Apply"}
                      </button>
                    )}
                  </div>

                  {promoMessage && (
                    <div
                      className={`text-[11px] mt-2 p-2 rounded flex items-center justify-between ${
                        promoMessage.type === "success"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <span>{promoMessage.text}</span>
                      {promoMessage.type === "success" && (
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-[10px] uppercase tracking-wider underline hover:text-red-700 ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-2.5 text-xs text-muted-taupe pt-4 border-t border-soft-stone">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-charcoal font-medium font-serif text-sm">
                      {formatCurrency(cartSubtotal)}
                    </span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between items-center text-green-700">
                      <span>Privilege Savings ({promoCouponInfo?.name || "Promotional Discount"})</span>
                      <span>-{formatCurrency(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="uppercase text-charcoal">
                      {shippingCost === 0 ? "Complimentary" : formatCurrency(shippingCost)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-charcoal">{formatCurrency(tax)}</span>
                  </div>

                  <div className="pt-3 border-t border-soft-stone flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider text-charcoal font-semibold">
                      Total Due
                    </span>
                    <span className="font-serif text-2xl font-semibold text-charcoal">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Order Submission Error Notice */}
                {submissionError && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded">
                    {submissionError}
                  </div>
                )}

                {/* Final Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-all duration-300 block text-center shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Securing Artisan Order..." : `Complete Order — ${formatCurrency(grandTotal)}`}
                </button>

                <p className="text-[10px] text-muted-taupe text-center leading-normal">
                  By clicking Complete Order, you authorize VELORÉ to process this demonstration order according to our terms of service and luxury privacy policy.
                </p>
              </div>
            </div>
          </form>
        </Container>
      </main>
    </div>
  );
}
