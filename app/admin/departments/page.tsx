
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronDown,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  Layers3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type Department = {
  id: number;
  name: string;
  company_id: number;
  company_name?: string;
  tenant_name?: string;
  status: string;
  created_at?: string;
};

type Company = {
  id: number;
  name: string;
  tenant_name?: string;
};

type DepartmentForm = {
  name: string;
  company_id: string;
  status: string;
};

const emptyForm: DepartmentForm = {
  name: "",
  company_id: "",
  status: "Active",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

async function readResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "The server returned a non-JSON response. Check that the Departments API route exists and restart the development server."
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "The request failed.");
  }

  return data;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState<DepartmentForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [departmentResponse, companyResponse] = await Promise.all([
        fetch("/api/admin/departments", { cache: "no-store" }),
        fetch("/api/admin/companies", { cache: "no-store" }),
      ]);

      const [departmentData, companyData] = await Promise.all([
        readResponse(departmentResponse),
        readResponse(companyResponse),
      ]);

      if (!Array.isArray(departmentData) || !Array.isArray(companyData)) {
        throw new Error("The Departments or Companies API returned unexpected data.");
      }

      setDepartments(departmentData);
      setCompanies(companyData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load departments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return departments.filter((department) => {
      const matchesSearch =
        !query ||
        department.name.toLowerCase().includes(query) ||
        (department.company_name || "").toLowerCase().includes(query) ||
        (department.tenant_name || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        department.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCompany =
        companyFilter === "All" ||
        String(department.company_id) === companyFilter;

      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [departments, search, statusFilter, companyFilter]);

  const activeCount = departments.filter(
    (department) => department.status.toLowerCase() === "active"
  ).length;

  const openCreateModal = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      company_id: companies.length ? String(companies[0].id) : "",
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setEditing(department);
    setForm({
      name: department.name,
      company_id: String(department.company_id),
      status: department.status,
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a department name.");
      return;
    }

    if (!form.company_id) {
      setError("Please select a company.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        company_id: Number(form.company_id),
        status: form.status,
      };

      const response = await fetch(
        editing
          ? `/api/admin/departments/${editing.id}`
          : "/api/admin/departments",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      await readResponse(response);

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setNotice(
        editing
          ? "Department updated successfully."
          : "Department created successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save department."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (department: Department) => {
    const confirmed = window.confirm(
      `Delete "${department.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(department.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/departments/${department.id}`,
        { method: "DELETE" }
      );

      await readResponse(response);

      setNotice("Department deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete department."
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  return (
    <div className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Layers3 size={16} />
              Organization management
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Departments
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Organize teams within your companies and manage department
              membership structures.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            disabled={companies.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add department
          </button>
        </div>

        {notice && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} />
            {notice}
          </div>
        )}

        {error && !modalOpen && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div className="flex-1">{error}</div>
            <button
              onClick={() => void loadData()}
              className="inline-flex shrink-0 items-center gap-1 font-semibold hover:underline"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total departments"
            value={departments.length}
            subtitle="Across all companies"
            icon={<Layers3 size={20} />}
            iconStyle="bg-indigo-50 text-indigo-600"
          />
          <SummaryCard
            title="Active departments"
            value={activeCount}
            subtitle={
              departments.length
                ? `${Math.round((activeCount / departments.length) * 100)}% of all departments`
                : "No departments yet"
            }
            icon={<CheckCircle2 size={20} />}
            iconStyle="bg-emerald-50 text-emerald-600"
          />
          <SummaryCard
            title="Companies"
            value={companies.length}
            subtitle="Available for department assignment"
            icon={<Building2 size={20} />}
            iconStyle="bg-violet-50 text-violet-600"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All departments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredDepartments.length} of {departments.length} departments
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="relative sm:col-span-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search departments..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div className="relative">
                  <select
                    value={companyFilter}
                    onChange={(event) => setCompanyFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="All">All companies</option>
                    {companies.map((company) => (
                      <option key={company.id} value={String(company.id)}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="All">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
              <LoaderCircle className="animate-spin" size={20} />
              Loading departments...
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Layers3 size={25} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                {departments.length === 0
                  ? "No departments yet"
                  : "No matching departments"}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {departments.length === 0
                  ? "Create your first department to start organizing your companies."
                  : "Try changing your search or filters to find a department."}
              </p>
              {departments.length === 0 && companies.length > 0 && (
                <button
                  onClick={openCreateModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Plus size={16} />
                  Create department
                </button>
              )}
              {companies.length === 0 && (
                <p className="mt-4 text-sm text-amber-700">
                  Create a company before adding a department.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Department</th>
                      <th className="px-6 py-4 font-semibold">Company</th>
                      <th className="px-6 py-4 font-semibold">Tenant</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Created</th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDepartments.map((department) => (
                      <tr
                        key={department.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                              <Layers3 size={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {department.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                ID: {department.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {department.company_name || `Company #${department.company_id}`}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {department.tenant_name || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={department.status} />
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {department.created_at
                            ? formatDate(department.created_at)
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              label="Edit department"
                              onClick={() => openEditModal(department)}
                            >
                              <Pencil size={16} />
                            </ActionButton>
                            <ActionButton
                              label="Delete department"
                              danger
                              disabled={deletingId === department.id}
                              onClick={() => void handleDelete(department)}
                            >
                              {deletingId === department.id ? (
                                <LoaderCircle className="animate-spin" size={16} />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-4 md:hidden">
                {filteredDepartments.map((department) => (
                  <div
                    key={department.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Layers3 size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-slate-900">
                            {department.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {department.company_name || `Company #${department.company_id}`}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={department.status} />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-500">
                        {department.tenant_name || "No tenant information"}
                      </p>
                      <div className="flex gap-2">
                        <ActionButton
                          label="Edit department"
                          onClick={() => openEditModal(department)}
                        >
                          <Pencil size={16} />
                        </ActionButton>
                        <ActionButton
                          label="Delete department"
                          danger
                          disabled={deletingId === department.id}
                          onClick={() => void handleDelete(department)}
                        >
                          {deletingId === department.id ? (
                            <LoaderCircle className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing ? "Edit department" : "Create department"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editing
                    ? "Update the department details below."
                    : "Add a department to one of your companies."}
                </p>
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-6">
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="department-name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Department name
                </label>
                <input
                  id="department-name"
                  className={inputClass}
                  placeholder="e.g. Engineering"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="department-company"
                  className="text-sm font-semibold text-slate-700"
                >
                  Company
                </label>
                <select
                  id="department-company"
                  className={inputClass}
                  value={form.company_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      company_id: event.target.value,
                    }))
                  }
                  required
                >
                  <option value="" disabled>
                    Select a company
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={String(company.id)}>
                      {company.name}
                      {company.tenant_name ? ` — ${company.tenant_name}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="department-status"
                  className="text-sm font-semibold text-slate-700"
                >
                  Status
                </label>
                <select
                  id="department-status"
                  className={inputClass}
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || companies.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving && <LoaderCircle className="animate-spin" size={17} />}
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Save changes"
                      : "Create department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconStyle,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconStyle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status.toLowerCase() === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  danger = false,
  disabled = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border p-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "border-rose-100 text-rose-600 hover:bg-rose-50"
          : "border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      {children}
    </button>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
