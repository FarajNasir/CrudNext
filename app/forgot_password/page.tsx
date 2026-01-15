"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.error);

    alert("✅ Reset link sent! Please check your email.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Forgot Password 🔑
        </h1>

        <p className="text-zinc-400 mb-6">
          Email enter karo, reset link aa jayega.
        </p>

        <form onSubmit={sendResetLink} className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-6">
          Back to{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-400 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
