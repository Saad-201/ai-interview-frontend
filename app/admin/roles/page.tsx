
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, ShieldCheck } from "lucide-react";

type Role = { id: number; name: string; permissions: string[] };

const availablePermissions = [
  "tenants:read", "tenants:write",
  "companies:read", "companies:write",
  "departments:read", "departments:write",
  "users:read", "users:write",
  "roles:read", "roles:write",
  "interviews:read", "interviews:write",
  "settings:read", "settings:write",
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadRoles() {
    try {
      const response = await fetch("/api/admin/roles", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load roles.");
      setRoles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load roles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadRoles(); }, []);

  function openCreate() {
    setEditingId(null);
    setName("");
    setPermissions([]);
    setError("");
    setModalOpen(true);
  }

  function openEdit(role: Role) {
    setEditingId(role.id);
    setName(role.name);
    setPermissions(role.permissions);
    setError("");
    setModalOpen(true);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/admin/roles/${editingId}` : "/api/admin/roles",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, permissions }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save role.");
      setModalOpen(false);
      setNotice(editingId ? "Role updated." : "Role created.");
      await loadRoles();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save role.");
    }
  }

  async function removeRole(role: Role) {
    if (!window.confirm(`Delete role "${role.name}"?`)) return;
    try {
      const response = await fetch(`/api/admin/roles/${role.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete role.");
      setNotice("Role deleted.");
      await loadRoles();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete role.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm text-slate-500"><Link href="/admin/dashboard">Admin</Link> / Roles</p>
          <h1 className="text-3xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="mt-2 text-sm text-slate-500">Define roles and control which platform modules they can access.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><Plus size={18} /> Create role</button>
      </header>

      {notice && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && !modalOpen && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? <p className="p-8 text-center text-slate-500">Loading roles...</p> : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <article key={role.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="rounded-xl bg-violet-50 p-3 text-violet-700"><ShieldCheck size={22} /></span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(role)} aria-label="Edit role" className="rounded-lg p-2 text-slate-500 hover:bg-blue-50"><Pencil size={16} /></button>
                  <button onClick={() => void removeRole(role)} aria-label="Delete role" className="rounded-lg p-2 text-slate-500 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">{role.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{role.permissions.length} permissions</p>
              <div className="mt-4 flex flex-wrap gap-2">{role.permissions.slice(0, 5).map((p) => <span key={p} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{p}</span>)}{role.permissions.length > 5 && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">+{role.permissions.length - 5} more</span>}</div>
            </article>
          ))}
          {!roles.length && <p className="rounded-xl border border-dashed p-8 text-center text-slate-500">No roles returned by the API.</p>}
        </section>
      )}

      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
        <form onSubmit={submit} className="my-6 w-full max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editingId ? "Edit role" : "Create role"}</h2><button type="button" onClick={() => setModalOpen(false)}><X size={20} /></button></div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="block text-sm font-medium">Role name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
          <p className="text-sm font-semibold text-slate-700">Permissions</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {availablePermissions.map((permission) => <label key={permission} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={permissions.includes(permission)} onChange={(e) => setPermissions((current) => e.target.checked ? [...current, permission] : current.filter((p) => p !== permission))} />{permission}</label>)}
          </div>
          <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border px-4 py-2.5 text-sm">Cancel</button><button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Save role</button></div>
        </form>
      </div>}
    </main>
  );
}
