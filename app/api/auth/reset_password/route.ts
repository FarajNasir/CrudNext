import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { password, access_token, refresh_token } = await req.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: "Reset session missing. Please open reset link again." },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // ✅ Set session first using tokens from reset link
    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      return NextResponse.json(
        { error: sessionError.message },
        { status: 400 }
      );
    }

    // ✅ Now update password
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
