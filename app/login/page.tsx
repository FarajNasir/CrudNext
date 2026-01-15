"use client";

import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-6 text-white">Loading...</p>}>
      <LoginClient />
    </Suspense>
  );
}
