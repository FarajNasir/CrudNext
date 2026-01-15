"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // /login?role=admin => admin login
  const isAdminLogin = searchParams.get("role") === "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role: isAdminLogin ? "admin" : "user",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            {isAdminLogin ? "Admin Login 🛡️" : "User Login 👤"}
          </h1>

          <p className="text-zinc-400 text-sm">
            {isAdminLogin
              ? "Only admins can login from here."
              : "Login to access your dashboard."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={login} className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={`w-full py-3 rounded-2xl text-lg font-bold transition shadow ${
              isAdminLogin
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
          >
            {isAdminLogin ? "Login as Admin" : "Login as User"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 flex flex-col gap-3 text-center text-sm text-zinc-400">
          <button
            onClick={() => router.push("/register")}
            className="text-blue-400 font-semibold hover:underline"
          >
            Create new account
          </button>

          {!isAdminLogin ? (
            <button
              onClick={() => router.push("/login?role=admin")}
              className="text-yellow-400 font-semibold hover:underline"
            >
              Login as Admin instead
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-white font-semibold hover:underline"
            >
              Login as User instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
