"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle } from "lucide-react";

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
          setError(result.message);
          return;
        }

        setUser(result.user);
      } catch (error) {
        console.error(error);
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading user information...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  let dashboardLink = "/";

  if (user?.role === "Tenant Admin") {
    dashboardLink = "/admin";
  } else if (user?.role === "Recruiter") {
    dashboardLink = "/recruiter";
  } else if (user?.role === "Candidate") {
    dashboardLink = "/candidate";
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

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href={dashboardLink}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              href="/me"
              className="text-blue-600"
              title="Profile"
            >
              <UserCircle size={32} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Profile */}
      <section className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          Current User
        </h1>

        {user && (
          <div className="text-center">
            <p className="mb-2">
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}