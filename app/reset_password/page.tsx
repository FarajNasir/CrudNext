"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // recovery

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // ✅ Verify token hash and create session
  useEffect(() => {
    const verify = async () => {
      if (!tokenHash || !type) {
        alert("Invalid reset link. Please request a new one.");
        router.push("/login");
        return;
      }

      const { error } = await supabaseClient.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (error) {
        alert(error.message);
        router.push("/login");
        return;
      }

      setChecking(false);
    };

    verify();
  }, [tokenHash, type, router]);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      return alert("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    setLoading(true);

    const { error } = await supabaseClient.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) return alert(error.message);

    alert("✅ Password updated successfully. Please login again.");
    router.push("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Checking reset link...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 shadow-2xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Reset Password 🔁
        </h1>

        <p className="text-zinc-400 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={updatePassword} className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-green-500"
            placeholder="New Password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Confirm New Password"
            type="password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-2xl text-lg font-bold hover:bg-green-700 transition shadow disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
