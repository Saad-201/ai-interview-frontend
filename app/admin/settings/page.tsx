
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Save, Settings2 } from "lucide-react";

type Settings = {
  platformName: string;
  supportEmail: string;
  defaultPlan: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  interviewDuration: number;
  maxInterviewAttempts: number;
};

const defaults: Settings = {
  platformName: "AI Interview Platform",
  supportEmail: "support@example.com",
  defaultPlan: "Starter",
  allowRegistration: true,
  maintenanceMode: false,
  interviewDuration: 30,
  maxInterviewAttempts: 3,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/settings", { cache: "no-store" });
        if (!response.ok) throw new Error("Settings API is not ready yet.");
        const data = await response.json();
        setSettings({ ...defaults, ...data });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load settings.");
      } finally {
        setLoading(false);
      }
    }
    void loadSettings();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save settings.");
      setSettings({ ...defaults, ...data });
      setNotice("Platform settings saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm";

  return (
    <main className="mx-auto max-w-5xl space-y-7">
      <header>
        <p className="mb-2 text-sm text-slate-500"><Link href="/admin/dashboard">Admin</Link> / Settings</p>
        <h1 className="text-3xl font-bold text-slate-900">Platform settings</h1>
        <p className="mt-2 text-sm text-slate-500">Configure platform defaults and interview behavior.</p>
      </header>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}

      {loading ? <p className="p-8 text-center text-slate-500">Loading settings...</p> : (
        <form onSubmit={submit} className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><Settings2 size={22} /></span><div><h2 className="font-bold text-slate-900">General</h2><p className="text-sm text-slate-500">Platform identity and support contact.</p></div></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">Platform name<input required value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} className={inputClass} /></label>
              <label className="text-sm font-medium">Support email<input required type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} className={inputClass} /></label>
              <label className="text-sm font-medium">Default tenant plan<select value={settings.defaultPlan} onChange={(e) => setSettings({ ...settings, defaultPlan: e.target.value })} className={inputClass}><option>Trial</option><option>Starter</option><option>Professional</option><option>Enterprise</option></select></label>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">Access and availability</h2>
            {[
              { key: "allowRegistration" as const, title: "Allow registrations", description: "Allow new candidate accounts to register." },
              { key: "maintenanceMode" as const, title: "Maintenance mode", description: "Mark the platform as temporarily under maintenance." },
            ].map((item) => <label key={item.key} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"><span><span className="block text-sm font-semibold text-slate-800">{item.title}</span><span className="mt-1 block text-sm text-slate-500">{item.description}</span></span><input type="checkbox" checked={settings[item.key]} onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })} className="h-4 w-4" /></label>)}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-bold text-slate-900">Interview defaults</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">Interview duration (minutes)<input type="number" min={5} max={180} required value={settings.interviewDuration} onChange={(e) => setSettings({ ...settings, interviewDuration: Number(e.target.value) })} className={inputClass} /></label>
              <label className="text-sm font-medium">Maximum attempts<input type="number" min={1} max={10} required value={settings.maxInterviewAttempts} onChange={(e) => setSettings({ ...settings, maxInterviewAttempts: Number(e.target.value) })} className={inputClass} /></label>
            </div>
          </section>

          <div className="flex justify-end"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"><Save size={17} />{saving ? "Saving..." : "Save settings"}</button></div>
        </form>
      )}
    </main>
  );
}
