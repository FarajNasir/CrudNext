"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [message, setMessage] = useState("");

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const target = e.target as typeof e.target & {
    name: { value: string };
    email: { value: string };
    password: { value: string };
  };

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: target.name.value,
        email: target.email.value,
        password: target.password.value,
      }),
      headers: { "Content-Type": "application/json" },
    });

    let data: any = {};
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }

    if (res.ok) {
      setMessage("Registered successfully!");
      setTimeout(() => router.push("/login"), 1000);
    } else {
      setMessage(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Network or JSON error:", err);
    setMessage("Network error");
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <input name="name" placeholder="Name" className="border p-2 w-full mb-2" required />
      <input name="email" placeholder="Email" className="border p-2 w-full mb-2" required />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-2" required />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full">Register</button>
      <p>{message}</p>
    </form>
  );
}
