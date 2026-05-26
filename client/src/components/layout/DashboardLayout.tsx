"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, Sparkles, X } from "lucide-react";
import { DashboardBackground } from "./DashboardBackground";
import { DashboardNav, DashboardUserPanel, Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCreate = pathname === "/dashboard/create";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <div className="relative min-h-screen bg-[#030304]">
      <DashboardBackground />
      <Sidebar />

      <header className="glass sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200 transition hover:bg-white/[0.08]"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">Smart Notes</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {!isCreate && (
            <Link
              href="/dashboard/create"
              className="btn-primary flex h-9 w-9 items-center justify-center rounded-xl p-0"
              aria-label="Create note"
            >
              <Plus className="h-4 w-4" />
            </Link>
          )}
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close navigation menu"
          />
          <aside className="glass relative z-10 flex h-full w-[min(86vw,320px)] flex-col border-r border-white/[0.08] px-4 py-6 shadow-2xl shadow-black/40">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-2"
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                  <Sparkles className="h-5 w-5 text-white" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
                </div>
                <div>
                  <h1 className="text-[15px] font-semibold tracking-tight text-white">
                    Smart Notes
                  </h1>
                  <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                    AI Workspace
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200 transition hover:bg-white/[0.08]"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DashboardNav onNavigate={() => setMobileMenuOpen(false)} />
            <div className="mt-auto">
              <DashboardUserPanel onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <main className="relative min-h-screen p-4 sm:p-6 lg:ml-[270px] lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
