"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  sessionUserEmail: string;
  sessionUserRole: string;
}

export default function DashboardClient({ sessionUserEmail, sessionUserRole }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user._id}`, { method: "DELETE" });
      if (!res.ok) return console.error("Failed to delete user");

      setUsers(users.filter(u => u._id !== user._id));

      // Self-delete → logout
      if (user.email === sessionUserEmail) {
        signOut({ callbackUrl: "/login" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save edited name only
  const handleSave = async (user: User) => {
    if (!nameInput.trim()) return;

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        body: JSON.stringify({ name: nameInput }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) return console.error("Failed to update user");

      const updated = await res.json();

      setUsers(users.map(u =>
        u._id === user._id
          ? { ...u, name: updated.user.name } // only name updated
          : u
      ));

      setEditingId(null);
      setNameInput("");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Logout button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u._id} className="border p-2 rounded flex justify-between items-center">
              {/* User info / edit input */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {editingId === u._id ? (
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : (
                  <>
                    <span className="font-semibold">{u.name}</span>
                    <span className="ml-2 text-gray-600">({u.email}) - <strong>{u.role}</strong></span>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-x-2">
                {(sessionUserRole === "ADMIN" || sessionUserEmail === u.email) && (
                  <>
                    {editingId === u._id ? (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => handleSave(u)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setEditingId(u._id);
                          setNameInput(u.name);
                        }}
                      >
                        Edit
                      </button>
                    )}

                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(u)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
