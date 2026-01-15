"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role"); // admin/user optional

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Login {role === "admin" ? "as Admin 🛡️" : "as User 👤"}
        </h1>

        <form onSubmit={login} className="space-y-4 mt-6">
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

          <button className="w-full bg-blue-600 text-white py-3 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
