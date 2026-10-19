"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Building,
  Users,
  ShieldCheck,
  Settings,
  UserCircle,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tenants",
    href: "/admin/tenants",
    icon: Building2,
  },
  {
    label: "Companies",
    href: "/admin/companies",
    icon: Building,
  },
  {
    label: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Roles & Permissions",
    href: "/admin/roles",
    icon: ShieldCheck,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <Link
          href="/admin/dashboard"
          className="flex h-20 items-center gap-3 border-b border-slate-100 px-6"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={23} />
          </div>

          <div>
            <p className="font-bold tracking-tight">
              AI Interview
            </p>
            <p className="text-xs text-slate-500">
              Platform Admin
            </p>
          </div>
        </Link>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Administration
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Manage your interview platform
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Search size={17} className="text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-36 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={20} />
            </button>

            <Link
              href="/me"
              title="Profile"
              aria-label="Profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <UserCircle size={25} />
            </Link>
          </div>
        </header>

        <main className="min-h-[calc(100vh-5rem)] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}