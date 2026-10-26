

"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Building2, CirclePlus, Search, ShieldCheck, Users, Pencil, Trash2, X } from "lucide-react";

type Tenant = {
  id: number;
  name: string;
  slug: string;
  plan: "Trial" | "Starter" | "Professional" | "Enterprise";
  status: "Active" | "Inactive";
  company_count: number;
  user_count: number;
  created_at: string;
};

const emptyForm = {
  name: "",
  slug: "",
  plan: "Trial" as Tenant["plan"],
  status: "Active" as Tenant["status"],
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTenants = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/tenants", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load tenants.");
      setTenants(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load tenants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTenants(); }, [loadTenants]);

  const filtered = useMemo(() => tenants.filter((t) => {
    const matches = `${t.name} ${t.slug}`.toLowerCase().includes(search.toLowerCase());
    return matches && (filter === "All" || t.status === filter);
  }), [tenants, search, filter]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(t: Tenant) {
    setEditingId(t.id);
    setForm({ name: t.name, slug: t.slug, plan: t.plan, status: t.status });
    setError("");
    setModalOpen(true);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        editingId ? `/api/admin/tenants/${editingId}` : "/api/admin/tenants",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save tenant.");

      setModalOpen(false);
      setNotice(editingId ? "Tenant updated." : "Tenant created.");
      await loadTenants();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save tenant.");
    }
  }

  async function removeTenant(t: Tenant) {
    if (!window.confirm(`Delete "${t.name}"?`)) return;
    setNotice("");
    try {
      const response = await fetch(`/api/admin/tenants/${t.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete tenant.");
      setNotice("Tenant deleted.");
      await loadTenants();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete tenant.");
    }
  }

  function updateName(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: editingId ? f.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  }

  const activeCount = tenants.filter((t) => t.status === "Active").length;
  const userCount = tenants.reduce((sum, t) => sum + Number(t.user_count || 0), 0);

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-slate-500">
            <Link href="/admin/dashboard" className="hover:text-blue-600">Admin</Link> / Tenants
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tenants</h1>
          <p className="mt-2 text-sm text-slate-500">Manage organizations, subscription plans, and access.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          <CirclePlus size={18} /> Add tenant
        </button>
      </header>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && !modalOpen && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total tenants", value: tenants.length, icon: Building2 },
          { label: "Active tenants", value: activeCount, icon: ShieldCheck },
          { label: "Associated users", value: userCount.toLocaleString(), icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm text-slate-500">
              {label}<span className="rounded-xl bg-blue-50 p-2 text-blue-600"><Icon size={20} /></span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenants..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
        </div>

        {loading ? <p className="p-8 text-center text-sm text-slate-500">Loading tenants...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>{["Tenant", "Plan", "Status", "Companies", "Users", "Actions"].map((h) => <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4"><p className="font-semibold text-slate-900">{t.name}</p><p className="mt-1 text-xs text-slate-500">{t.slug}</p></td>
                    <td className="px-5 py-4">{t.plan}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${t.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{t.status}</span></td>
                    <td className="px-5 py-4">{t.company_count ?? 0}</td>
                    <td className="px-5 py-4">{t.user_count ?? 0}</td>
                    <td className="px-5 py-4"><div className="flex gap-2">
                      <button aria-label="Edit tenant" onClick={() => openEdit(t)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button>
                      <button aria-label="Delete tenant" onClick={() => void removeTenant(t)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                    </div></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">No tenants found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form onSubmit={submit} className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Edit tenant" : "Create tenant"}</h2>
              <button type="button" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <label className="block text-sm font-medium">Organization name
              <input required value={form.name} onChange={(e) => updateName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <label className="block text-sm font-medium">Slug
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Plan
                <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value as Tenant["plan"] })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">
                  {["Trial", "Starter", "Professional", "Enterprise"].map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Tenant["status"] })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">
                  <option>Active</option><option>Inactive</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border px-4 py-2.5 text-sm">Cancel</button>
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{editingId ? "Save changes" : "Create tenant"}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
