"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminLayout({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs = [{ label: "Admin", href: "/admin" }],
}: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("admin@velore.com");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sign in state if unauthenticated
  const [loginEmail, setLoginEmail] = useState("admin@velore.com");
  const [loginPassword, setLoginPassword] = useState("VeloreAdmin2026!");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check admin session on mount
  const checkSession = async () => {
    try {
      const res = await fetch("/api/admin/auth/session");
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        if (data.user?.email) {
          setAdminEmail(data.user.email);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Authentication failed. Please verify administrator credentials.");
        setIsLoggingIn(false);
        return;
      }

      setIsAuthenticated(true);
      if (data.user?.email) {
        setAdminEmail(data.user.email);
      }
    } catch (err: any) {
      setLoginError("Network error attempting to verify administrative credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (e) {}
    setIsAuthenticated(false);
  };

  // 1. Loading Skeleton
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <span className="font-serif text-3xl font-medium tracking-wordmark text-charcoal animate-pulse">
            VELORÉ
          </span>
          <p className="text-xs text-muted-taupe tracking-widest uppercase">
            Verifying Administrator Credentials...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Administrative Access Portal)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-ivory text-charcoal flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          {/* Brand Wordmark */}
          <div className="text-center mb-8">
            <span className="font-serif text-3xl sm:text-4xl font-medium tracking-wordmark text-charcoal block">
              VELORÉ
            </span>
            <span className="text-[9px] uppercase tracking-widest text-champagne block mt-0.5">
              Haute Parfumerie &bull; Executive Portal
            </span>
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

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-taupe mb-1 font-medium">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-soft-stone rounded-sm bg-warm-ivory/30 focus:outline-none focus:border-charcoal text-charcoal font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-charcoal text-pure-white text-xs font-medium uppercase tracking-widest hover:bg-champagne hover:text-charcoal transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? "Verifying Credentials..." : "Authenticate & Open Console"}
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

  // 3. Authenticated Admin View
  return (
    <div className="min-h-screen bg-warm-ivory text-charcoal flex flex-col lg:flex-row antialiased selection:bg-champagne selection:text-white">
      {/* Persistent Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar onSignOut={handleSignOut} adminEmail={adminEmail} />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-charcoal">
            <AdminSidebar
              onSignOut={handleSignOut}
              adminEmail={adminEmail}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-pure-white border-b border-soft-stone px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:bg-soft-stone/40 rounded transition-colors"
              aria-label="Open admin navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="hidden sm:block">
              <ol className="flex items-center space-x-2 text-xs uppercase tracking-wider text-muted-taupe">
                {breadcrumbs.map((crumb, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    {idx > 0 && <span className="text-soft-stone">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-charcoal transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-charcoal font-medium">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-charcoal hover:text-champagne bg-warm-ivory border border-soft-stone rounded-sm transition-colors"
            >
              <span>Live Store</span>
              <span className="text-[10px]">↗</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-soft-stone">
              <div className="w-7 h-7 rounded-full bg-charcoal text-warm-ivory font-serif text-xs flex items-center justify-center font-medium">
                V
              </div>
              <span className="hidden md:inline text-xs text-charcoal font-medium">
                Administrator
              </span>
            </div>
          </div>
        </header>

        {/* Page Heading Banner */}
        <div className="bg-pure-white border-b border-soft-stone px-4 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-taupe mt-1 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>

            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>
        </div>

        {/* Main Workspace Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
