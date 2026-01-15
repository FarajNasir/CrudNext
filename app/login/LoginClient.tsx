"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role"); // admin/user optional

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingForgot, setLoadingForgot] = useState(false);

  // ✅ LOGIN
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    setLoadingLogin(false);

    if (!res.ok) return alert(data.error);

    router.push("/dashboard");
  };

  // ✅ FORGOT PASSWORD (INLINE)
  const sendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForgot(true);

    const res = await fetch("/api/auth/forgot_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });

    const data = await res.json();
    setLoadingForgot(false);

    if (!res.ok) return alert(data.error);

    alert("✅ Reset password link sent! Please check your email.");
    setShowForgot(false);
    setForgotEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Login {role === "admin" ? "as Admin 🛡️" : "as User 👤"}
        </h1>

        <p className="text-zinc-400 mb-6">
          Enter your email & password to continue.
        </p>

        {/* ✅ LOGIN FORM */}
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
            disabled={loadingLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow disabled:opacity-50"
          >
            {loadingLogin ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ✅ FORGOT PASSWORD BUTTON */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setShowForgot(!showForgot);
              setForgotEmail(email); // login email auto fill
            }}
            className="text-sm text-blue-400 font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* ✅ FORGOT PASSWORD INLINE FORM */}
        {showForgot && (
          <form
            onSubmit={sendResetLink}
            className="mt-5 space-y-3 border border-white/10 rounded-2xl p-4 bg-black/30"
          >
            <p className="text-sm text-zinc-300 font-semibold">
              Reset Password Link
            </p>

            <input
              className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              type="email"
              value={forgotEmail}
              required
              onChange={(e) => setForgotEmail(e.target.value)}
            />

            <button
              disabled={loadingForgot}
              className="w-full bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loadingForgot ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Register Link */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
