"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabaseClient.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      // profile role check
      const res = await fetch("/api/profile");
      const profile = await res.json();

      if (profile?.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p className="p-6">Loading Admin Panel...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="text-gray-500 mt-2">
        Admin only access page ✅
      </p>
    </div>
  );
}
