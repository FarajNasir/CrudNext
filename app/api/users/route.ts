import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    await connectDB();

    // ✅ Get current logged-in session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let users;

    if (session.user.role === "ADMIN") {
      // Admin sees all users
      users = await User.find({});
    } else {
      // Normal user sees only self
      users = await User.find({ email: session.user.email });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await User.create({
    name: body.name,
    email: body.email,
    password: hashedPassword,
  });

  return Response.json(user);
}
