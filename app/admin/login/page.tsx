"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@velore.com");
  const [password, setPassword] = useState("VeloreAdmin2026!");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Administrative authentication failed.");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError("Network error attempting to verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory text-charcoal flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl sm:text-4xl font-medium tracking-wordmark text-charcoal block">
              VELORÉ
            </span>
            <span className="text-[9px] uppercase tracking-widest text-champagne block mt-0.5">
              Haute Parfumerie &bull; Executive Portal
            </span>
          </Link>
        </div>

        <div className="bg-pure-white rounded-card border border-soft-stone p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-soft-stone pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal">
              <svg className="w-4 h-4 text-champagne" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Restricted Administrative Access</span>
            </div>
            <p className="text-xs text-muted-taupe mt-1">
              Authorized personnel only. Public client sessions are not permitted.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                Administrator Email
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
                Administrator Master Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Verifying Credentials..." : "Authenticate & Open Console"}
            </button>
          </form>

          <div className="pt-4 border-t border-soft-stone/80 text-[11px] text-muted-taupe space-y-2">
            <div className="bg-warm-ivory p-3 rounded-sm border border-soft-stone text-charcoal space-y-1">
              <span className="block font-semibold uppercase text-[10px] text-champagne tracking-wider">
                Verified Administrator Credentials
              </span>
              <p className="font-mono text-[10px]">Email: admin@velore.com</p>
              <p className="font-mono text-[10px]">Master Password: VeloreAdmin2026!</p>
            </div>
            <p className="text-[10px] text-muted-taupe text-center">
              To customize credentials, define <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in your environment.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-muted-taupe hover:text-charcoal transition-colors"
          >
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
