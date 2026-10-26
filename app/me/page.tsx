
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

type User = {
  id: number;
  email: string;
  role: string;
};

export default function MePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await fetch("/api/auth/me");
        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Unable to load your account.");
          return;
        }

        setUser(result.user);
      } catch (error) {
        console.error(error);
        setError("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  const dashboardLink =
    user?.role === "Tenant Admin"
      ? "/admin/dashboard"
      : user?.role === "Recruiter"
        ? "/recruiter"
        : user?.role === "Candidate"
          ? "/candidate"
          : "/";

  const initials = user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "U";

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Sparkles size={21} />
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              AI Interview Platform
            </span>
          </Link>

          <Link
            href={dashboardLink}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:px-4"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {loading ? (
          <div className="space-y-5" aria-label="Loading profile">
            <div className="h-48 animate-pulse rounded-3xl bg-slate-200" />
            <div className="grid gap-5 md:grid-cols-2">
              <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-red-700">
              Could not load your profile
            </p>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Try again
            </button>
          </div>
        ) : user ? (
          <div className="space-y-7">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-700 p-6 text-white shadow-xl sm:p-10">
              <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-4 -top-12 h-52 w-52 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute bottom-0 right-24 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl" />

              <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-bold shadow-lg backdrop-blur sm:h-24 sm:w-24 sm:text-3xl">
                    {initials}
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                        <CheckCircle2 className="mr-1 inline" size={13} />
                        Account loaded
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Your profile
                    </h1>
                    <p className="mt-2 max-w-md break-all text-sm text-blue-100 sm:text-base">
                      Manage your account and view your platform access.
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardLink}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-950 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50 sm:self-center"
                >
                  Open dashboard
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <UserRound size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Account information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Your current account details
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-5">
                  <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                    <Mail size={19} className="mt-0.5 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email address
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 text-slate-400"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Account role
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                    <BriefcaseBusiness
                      size={19}
                      className="mt-0.5 text-slate-400"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Platform access
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {user.role === "Tenant Admin"
                          ? "Administration portal"
                          : user.role === "Recruiter"
                            ? "Recruiter portal"
                            : user.role === "Candidate"
                              ? "Candidate portal"
                              : "General access"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <ShieldCheck size={22} />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-slate-900">
                    Your account role
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your assigned role determines which portal and features
                    are relevant to your account.
                  </p>
                  <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                    <span className="break-words">{user.role}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <Clock3 size={22} />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-slate-900">
                    Account settings
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This page currently displays account information. Editing
                    your profile and changing your password can be added when
                    the relevant API endpoints are available.
                  </p>
                </div>
              </div>
            </section>

            <p className="text-center text-xs text-slate-400">
              AI Interview Platform · Account overview
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-700">
              No user information was returned.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
