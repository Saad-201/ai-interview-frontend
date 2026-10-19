import Link from "next/link";
import {
  Building2,
  Users,
  Video,
  ArrowUpRight,
  Clock3,
  CircleCheck,
} from "lucide-react";

const stats = [
  {
    label: "Total Tenants",
    value: "12",
    change: "+2 this month",
    icon: Building2,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Total Users",
    value: "1,284",
    change: "+12.8% this month",
    icon: Users,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Interviews Completed",
    value: "856",
    change: "+8.4% this month",
    icon: Video,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Active Companies",
    value: "24",
    change: "Across all tenants",
    icon: Building2,
    color: "bg-amber-50 text-amber-600",
  },
];

const activities = [
  {
    title: "New tenant registered",
    description: "A new organization joined the platform",
    time: "Recently",
    icon: Building2,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Interview completed",
    description: "A candidate completed an interview",
    time: "Recently",
    icon: CircleCheck,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "User account created",
    description: "A new user account was added",
    time: "Recently",
    icon: Users,
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "Platform overview",
    description: "Review your organization and user settings",
    time: "Available",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
];

const quickLinks = [
  {
    title: "Manage Tenants",
    description: "View and manage organizations",
    href: "/admin/tenants",
  },
  {
    title: "Manage Companies",
    description: "Manage companies and departments",
    href: "/admin/companies",
  },
  {
    title: "Manage Users",
    description: "Review accounts and user roles",
    href: "/admin/users",
  },
  {
    title: "Roles & Permissions",
    description: "Control access across the platform",
    href: "/admin/roles",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-600">
            Platform overview
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor activity and manage your interview platform.
          </p>
        </div>

        <Link
          href="/admin/tenants"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Manage tenants
          <ArrowUpRight size={17} />
        </Link>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {stat.change}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Platform activity overview
              </p>
            </div>

            <Clock3 size={20} className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 px-6">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className="flex items-center gap-4 py-5"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {activity.description}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-xs text-slate-400">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold text-slate-900">
              Quick Access
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Common administration tasks
            </p>
          </div>

          <div className="space-y-2 p-4">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center justify-between rounded-xl p-4 transition hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-400 transition group-hover:text-blue-600"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Dashboard figures and activity entries are illustrative demo data.
      </p>
    </div>
  );
}