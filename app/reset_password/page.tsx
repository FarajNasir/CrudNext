"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenHash = searchParams.get("token_hash");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ Verify reset token via API (not UI supabase call)
  useEffect(() => {
    const verify = async () => {
      try {
        if (!tokenHash) {
          alert("Invalid reset link. Please request again.");
          router.push("/login");
          return;
        }

        await axios.post("/api/auth/verify_reset", {
          token_hash: tokenHash,
        });

        setChecking(false);
      } catch (err: any) {
        alert(err?.response?.data?.error || "Reset link verification failed");
        router.push("/login");
      }
    };

    verify();
  }, [tokenHash, router]);

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset_password", { password });

      alert("✅ Password updated successfully! Please login again.");
      router.push("/login");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
        <p className="text-white text-lg font-semibold">
          Verifying reset link...
        </p>
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
            placeholder="Confirm Password"
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
