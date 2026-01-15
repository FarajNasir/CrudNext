"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  name: string;
  bio: string;
  role: string;
  created_at: string;
};

type Todo = {
  id: string;
  user_id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);

    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      router.replace("/login");
      return;
    }

    // ✅ check role from profiles
    const { data: myProfile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (myProfile?.role !== "ADMIN") {
      alert("Access denied! Admin only.");
      router.replace("/dashboard");
      return;
    }

    // ✅ fetch all profiles
    const { data: allProfiles, error: pErr } = await supabaseClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (pErr) {
      alert(pErr.message);
      return;
    }

    // ✅ fetch all todos
    const { data: allTodos, error: tErr } = await supabaseClient
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (tErr) {
      alert(tErr.message);
      return;
    }

    setProfiles(allProfiles || []);
    setTodos(allTodos || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  if (loading) return <p className="p-6">Loading Admin Panel...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* USERS */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-3">All Users</h2>

        {profiles.length === 0 && (
          <p className="text-gray-500 text-sm">No users found.</p>
        )}

        <div className="space-y-3">
          {profiles.map((u) => (
            <div key={u.id} className="border p-3 rounded">
              <p>
                <b>Name:</b> {u.name}
              </p>
              <p>
                <b>Bio:</b> {u.bio}
              </p>
              <p>
                <b>Role:</b> {u.role}
              </p>
              <p className="text-xs text-gray-500">
                <b>ID:</b> {u.id}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TODOS */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-3">All Todos</h2>

        {todos.length === 0 && (
          <p className="text-gray-500 text-sm">No todos found.</p>
        )}

        <div className="space-y-3">
          {todos.map((t) => (
            <div key={t.id} className="border p-3 rounded">
              <p>
                <b>Title:</b> {t.title}
              </p>
              <p>
                <b>Status:</b> {t.is_done ? "Done ✅" : "Pending ❌"}
              </p>
              <p className="text-xs text-gray-500">
                <b>User ID:</b> {t.user_id}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
