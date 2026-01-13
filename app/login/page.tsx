"use client";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          email: { value: string };
          password: { value: string };
        };
        signIn("credentials", {
          email: target.email.value,
          password: target.password.value,
          callbackUrl: "/dashboard",
        });
      }}
      className="max-w-md mx-auto p-4"
    >
      <input name="email" placeholder="Email" className="border p-2 w-full mb-2" />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-2" />
      <button className="bg-blue-600 text-white p-2 w-full">Login</button>
    </form>
  );
}
