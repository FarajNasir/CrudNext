"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role"); // admin ya null

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    if (!data.user?.email_confirmed_at) {
      alert("Please verify your email first.");
      await supabaseClient.auth.signOut();
      return;
    }

    // ✅ Login ke baad redirect
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white mb-2">
          {role === "admin" ? "Admin Login" : "User Login"}
        </h1>
        <p className="text-zinc-400 mb-6">
          Please login to continue ✨
        </p>

        <form onSubmit={login} className="space-y-4">
          <input
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
            placeholder="Email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
            placeholder="Password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-white text-black py-3 rounded-2xl text-lg font-bold hover:bg-zinc-200 transition shadow">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
