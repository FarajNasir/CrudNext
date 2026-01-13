// app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to MyApp</h1>
        <p className="text-gray-600 mb-8">Your one-stop platform to manage users easily.</p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-green-500 text-white py-2 px-6 rounded-lg text-lg font-medium hover:bg-green-600 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
