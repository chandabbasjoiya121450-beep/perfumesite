"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/data/products";
import { Review, RatingSummary } from "@/lib/server/store-db";

interface ProductReviewsSectionProps {
  product: Product;
}

export function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("recent");

  // Write Review Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Report Modal
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<"spam" | "abusive" | "irrelevant" | "fake" | "other">("spam");
  const [reportNotes, setReportNotes] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  // Voting feedback
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/reviews?productId=${product.id}&sort=${sortBy}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setRatingSummary(data.ratingSummary || null);
      }
    } catch (e) {
      console.error("Failed to load product reviews:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id, sortBy]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating,
          title: title.trim(),
          body: reviewBody.trim(),
          customerName: name.trim(),
          customerEmail: email.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.review.status === "published") {
          setSubmitSuccess("Your impression has been verified and published. Thank you for your connoisseur feedback.");
        } else {
          setSubmitSuccess("Your impression has been submitted to our Paris atelier for editorial moderation.");
        }
        setTitle("");
        setReviewBody("");
        fetchReviews();
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(null);
        }, 3000);
      } else {
        setSubmitError(data.error || "Failed to submit review.");
      }
    } catch (e) {
      setSubmitError("Network failure while submitting your impression.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    if (votedMap[reviewId]) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdentifier: email || "connoisseur-visitor" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r
          )
        );
      }
    } catch (e) {
      console.error("Failed to submit helpful vote", e);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReviewId) return;

    setIsReporting(true);
    try {
      const res = await fetch(`/api/reviews/${reportingReviewId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reportReason,
          notes: reportNotes,
          reporterIdentifier: email || "anonymous-patron",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReportSuccess("Report submitted for confidential moderation.");
        setTimeout(() => {
          setReportingReviewId(null);
          setReportSuccess(null);
          setReportNotes("");
        }, 2000);
      }
    } catch (e) {
      console.error("Failed to submit report", e);
    } finally {
      setIsReporting(false);
    }
  };

  const averageRating = ratingSummary?.average || 0;
  const reviewCount = ratingSummary?.count || 0;

  return (
    <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-soft-stone">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-widest text-champagne font-medium block mb-2">
            Patron Impressions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-3">
            Client Reviews &amp; Reflections
          </h2>
          <p className="text-xs sm:text-sm text-muted-taupe leading-relaxed">
            Discover unfiltered sensory feedback from discerning connoisseurs who wear {product.name}.
          </p>
        </div>

        {/* Rating Breakdown & Summary Bar */}
        {reviewCount > 0 ? (
          <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-subtle mb-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Score Block (4 cols) */}
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-soft-stone pb-6 md:pb-0 md:pr-6">
              <span className="font-serif text-5xl font-medium text-charcoal block">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center justify-center md:justify-start gap-1 text-champagne text-lg my-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(averageRating)
                        ? "text-champagne"
                        : "text-soft-stone"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-taupe">
                Based on {reviewCount} verified {reviewCount === 1 ? "impression" : "impressions"}
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center justify-center h-10 px-5 bg-charcoal text-warm-ivory text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-black transition-colors"
              >
                Write an Impression
              </button>
            </div>

            {/* Middle Rating Distribution Bars (5 cols) */}
            <div className="md:col-span-5 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingSummary?.distribution?.[stars as keyof typeof ratingSummary.distribution] || 0;
                const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs text-muted-taupe">
                    <span className="w-12 text-right shrink-0">{stars} stars</span>
                    <div className="flex-1 h-2 bg-warm-ivory rounded-full overflow-hidden border border-soft-stone/40">
                      <div
                        className="h-full bg-champagne rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[11px] text-charcoal shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right Controls (3 cols) */}
            <div className="md:col-span-3 flex flex-col justify-center items-center md:items-end gap-3 text-xs">
              <div className="w-full">
                <label className="block text-[10px] uppercase tracking-wider text-muted-taupe font-semibold mb-1">
                  Sort Impressions
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/30 text-charcoal text-xs focus:outline-none focus:border-charcoal"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 sm:p-12 bg-pure-white rounded-card border border-soft-stone shadow-subtle text-center max-w-2xl mx-auto mb-10">
            <div className="w-12 h-12 rounded-full bg-soft-stone/40 text-champagne flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-2">
              Be the First to Experience {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-taupe leading-relaxed mb-6 max-w-md mx-auto">
              This handcrafted batch has not yet received verified patron reviews. Share your personal journey with this composition.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center h-11 px-7 bg-charcoal text-warm-ivory text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-black transition-colors shadow-sm"
            >
              Write an Impression
            </button>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-7 shadow-subtle space-y-3.5 transition-all"
              >
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-soft-stone/50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex text-champagne text-sm tracking-tighter">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={s <= rev.rating ? "text-champagne" : "text-soft-stone"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-serif text-base font-medium text-charcoal">
                      {rev.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-taupe">
                    <span className="font-medium text-charcoal">{rev.customerName}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                        ✓ Verified Purchase
                      </span>
                    )}
                    <span>&bull;</span>
                    <span className="text-[11px]">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-wrap font-sans">
                  {rev.body}
                </p>

                {/* Review Footer / Helpful & Report */}
                <div className="pt-2 flex items-center justify-between text-xs text-muted-taupe border-t border-soft-stone/30">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVoteHelpful(rev.id)}
                      disabled={Boolean(votedMap[rev.id])}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition-colors text-[11px] ${
                        votedMap[rev.id]
                          ? "bg-warm-ivory text-charcoal border-champagne"
                          : "border-soft-stone hover:border-charcoal hover:text-charcoal bg-white"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>Helpful ({rev.helpfulVotes || 0})</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReportingReviewId(rev.id)}
                    className="text-[11px] text-stone-400 hover:text-red-700 uppercase tracking-wider underline transition-colors"
                  >
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write Impression Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-pure-white rounded-card border border-soft-stone max-w-lg w-full p-6 sm:p-8 shadow-modal space-y-6 relative">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-muted-taupe hover:text-charcoal p-1"
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block">
                  Olfactory Reflection
                </span>
                <h3 className="font-serif text-2xl font-medium text-charcoal">
                  Reviewing {product.name}
                </h3>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded">
                  {submitError}
                </div>
              )}

              {submitSuccess ? (
                <div className="p-5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded text-center space-y-2">
                  <span className="text-2xl block">✦</span>
                  <p className="font-serif text-base font-semibold">{submitSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  {/* Star Rating Selector */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-2">
                      Your Scent Rating *
                    </label>
                    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          role="radio"
                          aria-checked={rating === star}
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                          className="text-2xl p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-champagne"
                        >
                          <span
                            className={
                              star <= (hoverRating || rating)
                                ? "text-champagne"
                                : "text-soft-stone"
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                      <span className="ml-2 font-mono text-xs text-charcoal font-semibold">
                        {rating} out of 5
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Impression Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sillage, projection, and unforgettable amber depth"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal focus:outline-none focus:border-charcoal"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Detailed Olfactory Experience *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe how the top, heart, and base notes unfold on your skin, the sillage duration, and memorable impressions..."
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal focus:outline-none focus:border-charcoal resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor V."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal focus:outline-none focus:border-charcoal"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                        Email Address (for order verification) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@velore.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal focus:outline-none focus:border-charcoal"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-soft-stone">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-soft-stone text-xs uppercase tracking-wider text-muted-taupe hover:text-charcoal transition-colors rounded-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-charcoal text-warm-ivory text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors rounded-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Impression"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Report Review Modal */}
        {reportingReviewId && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-pure-white rounded-card border border-soft-stone max-w-md w-full p-6 shadow-modal space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-soft-stone">
                <h4 className="font-serif text-lg text-charcoal">Report Impression</h4>
                <button
                  type="button"
                  onClick={() => setReportingReviewId(null)}
                  className="text-muted-taupe hover:text-charcoal p-1"
                >
                  ✕
                </button>
              </div>

              {reportSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded text-center">
                  {reportSuccess}
                </div>
              ) : (
                <form onSubmit={handleReport} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Reason for Report
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value as any)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal"
                    >
                      <option value="spam">Spam or Promotional Advertising</option>
                      <option value="abusive">Inappropriate or Offensive Language</option>
                      <option value="irrelevant">Not Related to this Fragrance</option>
                      <option value="fake">Suspected Inauthentic Feedback</option>
                      <option value="other">Other Concern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted-taupe mb-1">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Provide helpful context for our moderation team..."
                      value={reportNotes}
                      onChange={(e) => setReportNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-soft-stone rounded-sm bg-warm-ivory/20 text-charcoal"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-soft-stone">
                    <button
                      type="button"
                      onClick={() => setReportingReviewId(null)}
                      className="px-3 py-1.5 border border-soft-stone text-xs text-muted-taupe rounded-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isReporting}
                      className="px-4 py-1.5 bg-red-700 text-white text-xs uppercase tracking-wider rounded-sm hover:bg-red-800"
                    >
                      {isReporting ? "Reporting..." : "Submit Report"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
