
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Building2, CirclePlus, Search, Pencil, Trash2, X } from "lucide-react";

type Tenant = { id: number; name: string };
type Company = {
  id: number;
  name: string;
  slug: string;
  tenant_id: number;
  tenant_name: string;
  status: "Active" | "Inactive";
  department_count: number;
  user_count: number;
};

const emptyForm = {
  name: "",
  slug: "",
  tenantId: "",
  status: "Active" as Company["status"],
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [tenantFilter, setTenantFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [companyResponse, tenantResponse] = await Promise.all([
        fetch("/api/admin/companies", { cache: "no-store" }),
        fetch("/api/admin/tenants", { cache: "no-store" }),
      ]);

      const companyData = await companyResponse.json();
      const tenantData = await tenantResponse.json();

      if (!companyResponse.ok) throw new Error(companyData.error || "Could not load companies.");
      if (!tenantResponse.ok) throw new Error(tenantData.error || "Could not load tenants.");

      setCompanies(companyData);
      setTenants(tenantData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const filtered = useMemo(() => companies.filter((c) => {
    const matchesSearch = `${c.name} ${c.slug} ${c.tenant_name}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "All" || c.status === filter;
    const matchesTenant = tenantFilter === "All" || c.tenant_id === Number(tenantFilter);
    return matchesSearch && matchesStatus && matchesTenant;
  }), [companies, search, filter, tenantFilter]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, tenantId: tenants[0] ? String(tenants[0].id) : "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(c: Company) {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, tenantId: String(c.tenant_id), status: c.status });
    setError("");
    setModalOpen(true);
  }

  function updateName(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: editingId ? f.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        editingId ? `/api/admin/companies/${editingId}` : "/api/admin/companies",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            slug: form.slug.trim().toLowerCase(),
            tenantId: Number(form.tenantId),
            status: form.status,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save company.");

      setModalOpen(false);
      setNotice(editingId ? "Company updated." : "Company created.");
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save company.");
    }
  }

  async function removeCompany(c: Company) {
    if (!window.confirm(`Delete "${c.name}"?`)) return;
    setNotice("");
    try {
      const response = await fetch(`/api/admin/companies/${c.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete company.");
      setNotice("Company deleted.");
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete company.");
    }
  }

  const activeCount = companies.filter((c) => c.status === "Active").length;
  const departments = companies.reduce((sum, c) => sum + Number(c.department_count || 0), 0);
  // const users = companies.reduce((sum, c) => sum + Number(c.user_count || 0), 0);

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-slate-500"><Link href="/admin/dashboard" className="hover:text-blue-600">Admin</Link> / Companies</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Companies</h1>
          <p className="mt-2 text-sm text-slate-500">Manage companies and their parent organizations.</p>
        </div>
        <button onClick={openCreate} disabled={!tenants.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          <CirclePlus size={18} /> Add company
        </button>
      </header>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && !modalOpen && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total companies", value: companies.length },
          { label: "Active companies", value: activeCount },
          { label: "Departments", value: departments },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm text-slate-500">{item.label}<span className="rounded-xl bg-blue-50 p-2 text-blue-600"><Building2 size={20} /></span></div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies or tenants..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500" /></div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option>All</option><option>Active</option><option>Inactive</option></select>
          <select value={tenantFilter} onChange={(e) => setTenantFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="All">All tenants</option>{tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        </div>

        {loading ? <p className="p-8 text-center text-sm text-slate-500">Loading companies...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Company", "Tenant", "Status", "Departments", "Users", "Actions"].map((h) => <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4"><p className="font-semibold text-slate-900">{c.name}</p><p className="mt-1 text-xs text-slate-500">{c.slug}</p></td>
                    <td className="px-5 py-4">{c.tenant_name}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span></td>
                    <td className="px-5 py-4">{c.department_count ?? 0}</td>
                    <td className="px-5 py-4">{c.user_count ?? 0}</td>
                    <td className="px-5 py-4"><div className="flex gap-2"><button aria-label="Edit company" onClick={() => openEdit(c)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button><button aria-label="Delete company" onClick={() => void removeCompany(c)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">No companies found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
        <form onSubmit={submit} className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">{editingId ? "Edit company" : "Create company"}</h2><button type="button" onClick={() => setModalOpen(false)}><X size={20} /></button></div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="block text-sm font-medium">Company name<input required value={form.name} onChange={(e) => updateName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="block text-sm font-medium">Slug<input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="block text-sm font-medium">Parent tenant<select required value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">{tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
          <label className="block text-sm font-medium">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Company["status"] })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5"><option>Active</option><option>Inactive</option></select></label>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border px-4 py-2.5 text-sm">Cancel</button><button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{editingId ? "Save changes" : "Create company"}</button></div>
        </form>
      </div>}
    </main>
  );
}
