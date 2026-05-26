"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, LayoutDashboard, Plus, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import type { RootState } from "@/redux/store";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create Note", icon: Plus },
];

function DashboardBrand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 px-2">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
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
  );
}

export function DashboardNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex flex-1 flex-col gap-1.5 px-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200 ${
              active
                ? "bg-white/[0.08] text-white shadow-inner"
                : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500" />
            )}
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                active
                  ? "bg-violet-500/20 text-violet-300"
                  : "bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-400"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardUserPanel({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    onNavigate?.();
    router.push("/login");
  };

  return (
    <div className="space-y-3 border-t border-white/[0.06] pt-6">
      <div className="mx-2 rounded-xl bg-zinc-900/60 px-4 py-3 ring-1 ring-white/[0.04]">
        <p className="truncate text-xs font-medium text-white">{user?.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-500">{user?.email}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="glass fixed left-0 top-0 z-30 hidden h-screen w-[270px] flex-col border-r border-white/[0.06] px-4 py-7 lg:flex">
      <div className="mb-10">
        <DashboardBrand />
      </div>
      <DashboardNav />
      <div className="mt-auto">
        <DashboardUserPanel />
      </div>
    </aside>
  );
}
