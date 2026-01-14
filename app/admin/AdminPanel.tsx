"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: string;
  name: string | null;
  bio: string | null;
  role: "USER" | "ADMIN";
};

export default function AdminPanel() {
  const [users, setUsers] = useState<Profile[]>([]);

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (!res.ok) {
      alert("Admin only access");
      return;
    }
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (u: Profile) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: u.id,
        name: u.name,
        bio: u.bio,
        role: u.role,
      }),
    });

    alert("User updated");
    loadUsers();
  };

  const deleteUser = async (id: string) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    alert("User deleted");
    loadUsers();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Admin Panel</h1>

      {users.map((u) => (
        <div key={u.id} className="border p-4 rounded space-y-2">
          <input
            className="border p-2 w-full"
            value={u.name ?? ""}
            onChange={(e) =>
              setUsers((prev) =>
                prev.map((x) => (x.id === u.id ? { ...x, name: e.target.value } : x))
              )
            }
          />

          <textarea
            className="border p-2 w-full"
            value={u.bio ?? ""}
            onChange={(e) =>
              setUsers((prev) =>
                prev.map((x) => (x.id === u.id ? { ...x, bio: e.target.value } : x))
              )
            }
          />

          <select
            className="border p-2 w-full"
            value={u.role}
            onChange={(e) =>
              setUsers((prev) =>
                prev.map((x) =>
                  x.id === u.id ? { ...x, role: e.target.value as "USER" | "ADMIN" } : x
                )
              )
            }
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => updateUser(u)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Update
            </button>

            <button
              onClick={() => deleteUser(u.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
