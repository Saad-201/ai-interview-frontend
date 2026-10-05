
import Link from "next/link"; // this imports next.js navigation component

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        AI Interview Platform
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Practice your interview skills with an AI interviewer.
      </p>

      <Link
        href="/login" //this tells the next.js exactly where to go when the user clicks on the button
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Start Interview
      </Link>
    </main>
  );
}

