"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side (Text) */}
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-zinc-200 text-sm">
            🚀 Next.js + Supabase Auth + CRUD
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Welcome to <span className="text-blue-400">MyApp</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed">
            Manage your profile and To-Do tasks with secure authentication.
            Admin can view all users data, while users can only access their own.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Secure Auth
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
              CRUD Todos
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Admin Panel Logic
            </span>
          </div>
        </div>

        {/* Right Side (Card) */}
        <div className="rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white mb-2">
            Get Started ✨
          </h2>
          <p className="text-zinc-400 mb-6">
            Choose how you want to continue.
          </p>

          <div className="grid gap-4">
            {/* User Login */}
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-white text-black py-3 rounded-2xl text-lg font-bold hover:bg-zinc-200 transition shadow"
            >
              👤 Login as User
            </button>

            {/* Admin Login */}
            <button
              onClick={() => router.push("/login?role=admin")}
              className="w-full bg-yellow-500 text-black py-3 rounded-2xl text-lg font-bold hover:bg-yellow-400 transition shadow"
            >
              🛡️ Login as Admin
            </button>

            {/* Register */}
            <button
              onClick={() => router.push("/register")}
              className="w-full bg-blue-600 text-white py-3 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow"
            >
              📝 Create New Account
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-500">
            By continuing, you agree to our{" "}
            <span className="text-zinc-300 font-semibold">Terms</span> and{" "}
            <span className="text-zinc-300 font-semibold">Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
