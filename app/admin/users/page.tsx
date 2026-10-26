
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { CirclePlus, Search, Pencil, Trash2, X } from "lucide-react";

type User = {
  id: number;
  full_name?: string;
  email: string;
  role: string;
  status: string;
  tenant_id?: number | null;
  company_id?: number | null;
  department_id?: number | null;
  tenant_name?: string;
  company_name?: string;
  department_name?: string;
};

type Option = { id: number; name: string };

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "Candidate",
  status: "Active",
  tenantId: "",
  companyId: "",
  departmentId: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    try {
      const responses = await Promise.all([
        fetch("/api/admin/users", { cache: "no-store" }),
        fetch("/api/admin/tenants", { cache: "no-store" }),
        fetch("/api/admin/companies", { cache: "no-store" }),
        fetch("/api/admin/departments", { cache: "no-store" }),
      ]);
      const data = await Promise.all(responses.map((r) => r.json()));
      const failed = responses.find((r) => !r.ok);
      if (failed) throw new Error("Could not load user management data.");
      setUsers(data[0]);
      setTenants(data[1]);
      setCompanies(data[2]);
      setDepartments(data[3]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const visibleUsers = users.filter((u) =>
    `${u.full_name ?? ""} ${u.email} ${u.role} ${u.tenant_name ?? ""}`
      .toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(u: User) {
    setEditingId(u.id);
    setForm({
      fullName: u.full_name ?? "",
      email: u.email,
      password: "",
      role: u.role,
      status: u.status || "Active",
      tenantId: u.tenant_id ? String(u.tenant_id) : "",
      companyId: u.company_id ? String(u.company_id) : "",
      departmentId: u.department_id ? String(u.department_id) : "",
    });
    setError("");
    setModalOpen(true);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const body: Record<string, unknown> = {
      fullName: form.fullName,
      email: form.email,
      role: form.role,
      status: form.status,
      tenantId: form.tenantId ? Number(form.tenantId) : null,
      companyId: form.companyId ? Number(form.companyId) : null,
      departmentId: form.departmentId ? Number(form.departmentId) : null,
    };
    if (form.password) body.password = form.password;

    if (!editingId && !form.password) {
      setError("Enter a password for the new user.");
      return;
    }

    try {
      const response = await fetch(
        editingId ? `/api/admin/users/${editingId}` : "/api/admin/users",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save user.");
      setModalOpen(false);
      setNotice(editingId ? "User updated." : "User created.");
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save user.");
    }
  }

  async function removeUser(u: User) {
    if (!window.confirm(`Delete user "${u.email}"?`)) return;
    try {
      const response = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete user.");
      setNotice("User deleted.");
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete user.");
    }
  }

  const selectClass = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm";
  const inputClass = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm";

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-slate-500"><Link href="/admin/dashboard" className="hover:text-blue-600">Admin</Link> / Users</p>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="mt-2 text-sm text-slate-500">Manage accounts, roles, and organization assignments.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"><CirclePlus size={18} /> Add user</button>
      </header>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && !modalOpen && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative border-b border-slate-100 p-4"><Search className="absolute left-7 top-7 text-slate-400" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, role, or tenant..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500" /></div>
        {loading ? <p className="p-8 text-center text-sm text-slate-500">Loading users...</p> : <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["User", "Role", "Tenant", "Company", "Department", "Status", "Actions"].map((h) => <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map((u) => <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-5 py-4"><p className="font-semibold text-slate-900">{u.full_name || "Unnamed user"}</p><p className="mt-1 text-xs text-slate-500">{u.email}</p></td>
                <td className="px-5 py-4">{u.role}</td><td className="px-5 py-4">{u.tenant_name || "—"}</td><td className="px-5 py-4">{u.company_name || "—"}</td><td className="px-5 py-4">{u.department_name || "—"}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${u.status === "Inactive" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>{u.status || "Active"}</span></td>
                <td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => openEdit(u)} aria-label="Edit user" className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button><button onClick={() => void removeUser(u)} aria-label="Delete user" className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></div></td>
              </tr>)}
              {!visibleUsers.length && <tr><td colSpan={7} className="p-8 text-center text-slate-500">No users found.</td></tr>}
            </tbody>
          </table>
        </div>}
      </section>

      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
        <form onSubmit={submit} className="my-6 w-full max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editingId ? "Edit user" : "Create user"}</h2><button type="button" onClick={() => setModalOpen(false)}><X size={20} /></button></div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Full name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} /></label>
            <label className="text-sm font-medium">Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></label>
            <label className="text-sm font-medium">Password {editingId ? "(leave blank to keep current)" : ""}<input type="password" required={!editingId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} /></label>
            <label className="text-sm font-medium">Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={selectClass}>{["Super Admin", "Tenant Admin", "Company Admin", "Recruiter", "Candidate"].map((r) => <option key={r}>{r}</option>)}</select></label>
            <label className="text-sm font-medium">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}><option>Active</option><option>Inactive</option></select></label>
            <label className="text-sm font-medium">Tenant<select value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value, companyId: "", departmentId: "" })} className={selectClass}><option value="">None</option>{tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
            <label className="text-sm font-medium">Company<select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value, departmentId: "" })} className={selectClass}><option value="">None</option>{companies.filter((c) => !form.tenantId || (c as Option & { tenant_id?: number }).tenant_id === Number(form.tenantId)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label className="text-sm font-medium">Department<select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} className={selectClass}><option value="">None</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
          </div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border px-4 py-2.5 text-sm">Cancel</button><button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">{editingId ? "Save changes" : "Create user"}</button></div>
        </form>
      </div>}
    </main>
  );
}
