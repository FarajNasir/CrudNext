import DashboardClient from "./DashboardClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <p>Please login first</p>;

  return (
    <DashboardClient
      sessionUserEmail={session.user.email}
      sessionUserRole={session.user.role}
    />
  );
}
