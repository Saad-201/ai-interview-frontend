"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";

export default function CandidatePage() {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Website Name */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
          >
            AI Interview Platform
          </Link>

          {/* Profile */}
          <Link
            href="/me"
            className="text-gray-700 hover:text-blue-600"
            title="Profile"
          >
            <UserCircle size={32} />
          </Link>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">
          Candidate Dashboard
        </h1>

        <p className="mt-4 text-gray-600">
          You are logged in as Candidate.
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </section>
    </main>
  );
}