"use client";

export default function RecruiterPage() {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        Admin Dashboard
      </h1>

      <p className="mt-4 text-gray-600">
        You are logged in as Recruiter.
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  );
}