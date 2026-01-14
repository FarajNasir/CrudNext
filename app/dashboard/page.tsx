import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await supabaseServer(); // ✅ MUST await
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return <DashboardClient userEmail={data.user.email!} />;
}
