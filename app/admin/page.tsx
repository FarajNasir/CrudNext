import AdminPanel from "./AdminPanel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

    // 🔐 Guard: not logged in
  if (!session || !session.user) {
    redirect("/login");
  }

  // 🔐 Guard: not admin
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return (
    <AdminPanel
      sessionUserEmail={session.user.email}
      sessionUserRole={session.user.role}
    />
  );
}
