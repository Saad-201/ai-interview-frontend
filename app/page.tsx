import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo / Website Name */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
          >
            AI Interview Platform
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI Interview Platform
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl">
          Practice your interview skills with an AI interviewer.
        </p>
      </section>
    </main>
  );
}