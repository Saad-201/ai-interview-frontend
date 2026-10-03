
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        AI Interview Platform
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Practice your interview skills with an AI interviewer.
      </p>

      <button className="bg-black text-white px-6 py-3 rounded-lg">
        Start Interview
      </button>
    </main>
  );
}

