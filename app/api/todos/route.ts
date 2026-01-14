import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { title } = await req.json();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("todos")
    .insert({ user_id: authData.user.id, title })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, todo: data });
}

export async function PUT(req: Request) {
  const supabase = await supabaseServer();
  const { id, title, is_done } = await req.json();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("todos")
    .update({ title, is_done })
    .eq("id", id)
    .eq("user_id", authData.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, todo: data });
}

export async function DELETE(req: Request) {
  const supabase = await supabaseServer();
  const { id } = await req.json();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
