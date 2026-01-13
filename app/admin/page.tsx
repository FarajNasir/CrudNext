import AdminPanel from "./AdminPanel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard"); // Only admins allowed
  }

  return (
    <AdminPanel
      sessionUserEmail={session.user.email}
      sessionUserRole={session.user.role}
    />
  );
}
