"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface Props {
  sessionUserEmail: string;
  sessionUserRole: string;
}

export default function AdminPanel({ sessionUserEmail, sessionUserRole }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users
  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        // ✅ Admin sees all users, normal user sees only self
        if (sessionUserRole === "ADMIN") {
          setUsers(data.users);
        } else {
          setUsers(data.users.filter((u: User) => u.email === sessionUserEmail));
        }
      });
  }, [sessionUserEmail, sessionUserRole]);

  const handleDelete = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user._id}`, { method: "DELETE" });
      if (!res.ok) return console.error("Failed to delete user");

      setUsers(users.filter(u => u._id !== user._id));

      // Logout if self-deleted
      if (user.email === sessionUserEmail) {
        signOut({ callbackUrl: "/login" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-b">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                {/* Admin can edit/delete anyone, normal user only self */}
                {(sessionUserRole === "ADMIN" || sessionUserEmail === u.email) && (
                  <button
                    className="bg-red-600 text-white p-1"
                    onClick={() => handleDelete(u)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
