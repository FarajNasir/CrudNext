"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Todo = {
  id: string;
  user_id: string;
  user_name: string | null;
  title: string;
  is_done: boolean;
  created_at: string;
};

type ProfileMini = {
  id: string;
  name: string | null;
};

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const router = useRouter();

  const [role, setRole] = useState<string>("USER");
  const [myName, setMyName] = useState<string>("");

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // ✅ Admin owner name mapping (user_id -> name)
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  const loadDashboardData = async () => {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) return;

    // ✅ Fetch profile role + name
    const { data: profileData, error: profileErr } = await supabaseClient
      .from("profiles")
      .select("role,name")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileErr) {
      console.log("Profile Error:", profileErr.message);
    }

    const currentRole = profileData?.role ?? "USER";
    setRole(currentRole);
    setMyName(profileData?.name ?? "");

    // ✅ Fetch Todos
    let query = supabaseClient
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    // USER -> only own todos
    if (currentRole !== "ADMIN") {
      query = query.eq("user_id", userData.user.id);
    }

    const { data: todosData, error: todosErr } = await query;

    if (todosErr) {
      alert(todosErr.message);
      return;
    }

    setTodos(todosData || []);

    // ✅ If ADMIN, fetch all users names from profiles (NO JOIN)
    if (currentRole === "ADMIN") {
      const { data: profilesData, error: profilesErr } = await supabaseClient
        .from("profiles")
        .select("id,name");

      if (profilesErr) {
        console.log("Profiles Error:", profilesErr.message);
        return;
      }

      const map: Record<string, string> = {};
      (profilesData as ProfileMini[] | null)?.forEach((p) => {
        map[p.id] = p.name || "Unknown";
      });

      setUsersMap(map);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ✅ Add Todo (save user_name too)
  const addTodo = async () => {
    if (!title.trim()) return;

    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      alert("Session expired. Please login again.");
      router.replace("/login");
      return;
    }

    // get profile name
    const { data: profileData } = await supabaseClient
      .from("profiles")
      .select("name")
      .eq("id", userData.user.id)
      .maybeSingle();

    const { error } = await supabaseClient.from("todos").insert({
      user_id: userData.user.id,
      user_name: profileData?.name ?? "Unknown",
      title,
      is_done: false,
    });

    if (error) return alert(error.message);

    setTitle("");
    loadDashboardData();
  };

  // ✅ Toggle Done
  const toggleDone = async (todo: Todo) => {
    const { error } = await supabaseClient
      .from("todos")
      .update({ is_done: !todo.is_done })
      .eq("id", todo.id);

    if (error) return alert(error.message);

    loadDashboardData();
  };

  // ✅ Start Edit
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  // ✅ Save Edit
  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabaseClient
      .from("todos")
      .update({ title: editingTitle })
      .eq("id", editingId);

    if (error) return alert(error.message);

    setEditingId(null);
    setEditingTitle("");
    loadDashboardData();
  };

  // ✅ Delete Todo
  const deleteTodo = async (id: string) => {
    const { error } = await supabaseClient.from("todos").delete().eq("id", id);

    if (error) return alert(error.message);

    loadDashboardData();
  };

  // ✅ Logout (cookies)
  const logout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  router.push("/login");
};


  const doneCount = todos.filter((t) => t.is_done).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Manage your tasks easily ✨
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg font-semibold shadow"
          >
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
            <p className="text-zinc-400 text-sm">Logged in as</p>
            <p className="text-lg font-semibold mt-1">{userEmail}</p>

            {myName && (
              <p className="text-sm text-zinc-300 mt-2">
                Name: <span className="font-semibold text-white">{myName}</span>
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg">
            <p className="text-zinc-400 text-sm">Role</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  role === "ADMIN"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {role}
              </span>
            </div>

            <div className="mt-4 text-sm text-zinc-300">
              <p>
                Total:{" "}
                <span className="font-semibold text-white">{todos.length}</span>
              </p>
              <p>
                Done:{" "}
                <span className="font-semibold text-green-400">{doneCount}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Todo Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-bold">
              {role === "ADMIN" ? "All Users Todos" : "My To-Do List"}
            </h2>

            <span className="text-xs text-zinc-400">
              Tip: Click checkbox to mark done ✔
            </span>
          </div>

          {/* Add Todo */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 border border-white/10 bg-black/30 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Write a new todo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              onClick={addTodo}
              className="bg-white text-black hover:bg-zinc-200 transition px-6 py-3 rounded-xl font-bold shadow"
            >
              Add Todo
            </button>
          </div>

          {/* Todo List */}
          <div className="mt-6 space-y-3">
            {todos.length === 0 && (
              <div className="text-sm text-zinc-400 border border-white/10 bg-black/20 p-4 rounded-xl">
                No todos yet. Add your first task 🚀
              </div>
            )}

            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-white/10 bg-black/20 p-4 rounded-2xl"
              >
                {/* Left */}
                <div className="flex items-start gap-3 w-full">
                  <input
                    className="mt-1"
                    type="checkbox"
                    checked={todo.is_done}
                    onChange={() => toggleDone(todo)}
                  />

                  <div className="w-full">
                    {/* Title */}
                    {editingId === todo.id ? (
                      <input
                        className="w-full border border-white/10 bg-black/30 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-white/20"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                      />
                    ) : (
                      <p
                        className={`text-base font-medium ${
                          todo.is_done
                            ? "line-through text-zinc-500"
                            : "text-white"
                        }`}
                      >
                        {todo.title}
                      </p>
                    )}

                    {/* ✅ Owner name for ADMIN */}
                    {role === "ADMIN" && (
                      <p className="text-xs text-zinc-400 mt-1">
                        Owner:{" "}
                        <span className="text-zinc-200 font-semibold">
                          {todo.user_name || usersMap[todo.user_id] || "Unknown"}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Buttons */}
                <div className="flex gap-2 justify-end">
                  {editingId === todo.id ? (
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-xl font-semibold"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(todo)}
                      className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl font-semibold"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
