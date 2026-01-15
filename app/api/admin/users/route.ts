import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.from("profiles").select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });

  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const supabase = await supabaseServer(); // ✅ FIX
  const body = await req.json();

  const { userId, name, bio, role } = body;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .update({ name, bio, role })
    .eq("id", userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });

  return NextResponse.json({ success: true, profile: data });
}

export async function DELETE(req: Request) {
  const supabase = await supabaseServer(); // ✅ FIX
  const body = await req.json();
  const { userId } = body;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });

  return NextResponse.json({ success: true });
}
