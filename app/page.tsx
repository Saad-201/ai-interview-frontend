import Link from "next/link";
import {
  BrainCircuit,
  Mic,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight">
                AI Interview
              </p>
              <p className="text-xs text-slate-400">Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              <Sparkles className="h-4 w-4" />
              AI-powered recruitment
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Smarter Interviews.
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Better Hiring Decisions.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Conduct intelligent AI-powered interviews, evaluate candidates
              faster, and make better hiring decisions with one modern
              recruitment platform.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-20 max-w-6xl">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-blue-950/40 backdrop-blur">
              <div className="rounded-xl border border-white/10 bg-slate-900 p-6">
                {/* Fake top bar */}
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Dashboard
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      Welcome back 👋
                    </p>
                  </div>

                  <div className="hidden items-center gap-2 sm:flex">
                    <div className="h-9 w-9 rounded-full bg-blue-600/20" />
                    <div className="h-3 w-20 rounded bg-white/10" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    icon={<Users className="h-5 w-5" />}
                    label="Candidates"
                    value="128"
                    change="+12%"
                  />

                  <StatCard
                    icon={<Mic className="h-5 w-5" />}
                    label="Interviews"
                    value="42"
                    change="+8%"
                  />

                  <StatCard
                    icon={<BarChart3 className="h-5 w-5" />}
                    label="Evaluations"
                    value="36"
                    change="+15%"
                  />

                  <StatCard
                    icon={<BrainCircuit className="h-5 w-5" />}
                    label="Avg. AI Score"
                    value="87%"
                    change="+4%"
                  />
                </div>

                {/* Lower dashboard */}
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Interview Activity</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Candidate interviews over time
                        </p>
                      </div>

                      <BarChart3 className="h-5 w-5 text-blue-400" />
                    </div>

                    <div className="mt-8 flex h-32 items-end gap-3">
                      {[45, 65, 52, 78, 62, 88, 72, 95, 80, 100, 84, 92].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400 opacity-80"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="font-semibold">Recent Interviews</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Latest candidate activity
                    </p>

                    <div className="mt-6 space-y-4">
                      {[
                        ["Youssef Ali", "Frontend Developer", "88%"],
                        ["Nour Ibrahim", "Backend Developer", "72%"],
                        ["Layla Mahmoud", "Tech Lead", "91%"],
                      ].map(([name, role, score]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {role}
                            </p>
                          </div>

                          <span className="ml-3 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                            {score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mx-auto mt-24 max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Everything you need
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Modern tools for modern hiring
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Bring interviews, candidate evaluation, and hiring decisions
                together in one intelligent platform.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<BrainCircuit />}
                title="AI Interviews"
                description="Conduct structured interviews powered by intelligent AI workflows."
              />

              <FeatureCard
                icon={<BarChart3 />}
                title="Smart Evaluation"
                description="Turn interview performance into clear and actionable scores."
              />

              <FeatureCard
                icon={<Users />}
                title="Candidate Management"
                description="Organize candidates and keep the entire hiring process in one place."
              />

              <FeatureCard
                icon={<Mic />}
                title="Voice Interviews"
                description="Support natural voice-based interviews with real-time interaction."
              />
            </div>
          </div>

          {/* Final CTA */}
          <div className="mx-auto mt-24 max-w-4xl rounded-3xl border border-blue-400/10 bg-gradient-to-br from-blue-600/10 to-cyan-400/5 p-10 text-center sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to make hiring smarter?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Start exploring the AI Interview Platform and experience a
              smarter way to evaluate candidates.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Create an Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 AI Interview Platform</p>

          <p>AI-powered recruitment and interview management</p>
        </div>
      </footer>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-blue-400/20 hover:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <span className="text-xs font-medium text-emerald-400">
          {change}
        </span>
      </div>

      <p className="mt-5 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.04]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/20">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-xs font-medium text-blue-400">
        <CheckCircle2 className="h-4 w-4" />
        Built into the platform
      </div>
    </div>
  );
}