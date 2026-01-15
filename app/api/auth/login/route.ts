import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { email, password, role } = await req.json(); 
  // role = "admin" | "user"

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // ✅ Email verification required
  if (!data.user?.email_confirmed_at) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Please verify your email first." },
      { status: 403 }
    );
  }

  // 🔥 Fetch profile role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Profile not found. Please try again." },
      { status: 403 }
    );
  }

  const dbRole = profile?.role ?? "USER";

  // ✅ STRICT ROLE RULES
  // If trying to login as admin -> must be ADMIN
  if (role === "admin" && dbRole !== "ADMIN") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Access denied ❌ Only admin can login here." },
      { status: 403 }
    );
  }

  // If trying to login as user -> must NOT be ADMIN
  if (role === "user" && dbRole === "ADMIN") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Please use Admin Login button 🛡️" },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, role: dbRole });
}
