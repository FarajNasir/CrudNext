import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer(); // ✅ FIX

  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const supabase = await supabaseServer(); // ✅ FIX
  const body = await req.json();

  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: authData.user.id,
      name: body.name ?? "",
      bio: body.bio ?? "",
      // role: "USER",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, profile: data });
}
