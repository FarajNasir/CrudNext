"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // role param from URL => /login?role=admin
  const loginType = searchParams.get("role"); // "admin" | null
  const isAdminLogin = loginType === "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    // ✅ Email verification check
    if (!data.user?.email_confirmed_at) {
      alert("Please verify your email first.");
      await supabaseClient.auth.signOut();
      return;
    }

     const { data: profileData, error: profileError } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

         if (profileError) {
        alert("Profile not found. Please try again.");
        await supabaseClient.auth.signOut();
        return;
      }

    // ✅ If Admin Login, enforce ADMIN role
    if (isAdminLogin) {
     

     

      if (profileData?.role !== "ADMIN") {
        alert("Access Denied ❌ You are not an admin.");
        await supabaseClient.auth.signOut();
        router.push("/login");
        return;
      }
    }
    else{
      if (profileData?.role === "ADMIN") {
        alert("Access Denied ❌ You are not a user.");
        await supabaseClient.auth.signOut();
        router.push("/login");
        return;
      }
    }

    // ✅ Success redirect
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          {isAdminLogin ? "Admin Login 🛡️" : "User Login 👤"}
        </h1>

        <p className="text-zinc-400 mb-6">
          {isAdminLogin
            ? "Only admins can login from here."
            : "Login to access your dashboard."}
        </p>

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

        <div className="mt-6 text-center text-sm text-zinc-400">
          New user?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-400 font-semibold hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
