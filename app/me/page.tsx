"use client";

import { useEffect, useState } from "react";

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
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
    </main>
  );
}