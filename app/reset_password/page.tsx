import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center px-4">
          <p className="text-white text-lg font-semibold">
            Loading reset page...
          </p>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
