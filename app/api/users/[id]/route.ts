import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userToDelete = await User.findById(id);
  if (!userToDelete) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Permission: admin can delete anyone, normal user can delete self
  if (session.user.role !== "ADMIN" && session.user.email !== userToDelete.email) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await User.findByIdAndDelete(id);

  return NextResponse.json({
    message: "User deleted successfully",
    user: { _id: userToDelete._id, email: userToDelete.email, name: userToDelete.name, role: userToDelete.role },
  });
}


export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userToDelete = await User.findById(id);
  if (!userToDelete) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Permission: admin can delete anyone, normal user can delete self
  if (session.user.role !== "ADMIN" && session.user.email !== userToDelete.email) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

   const { name } = await req.json();

  if (name) {
      await User.findByIdAndUpdate(id, { name });
  }

  return NextResponse.json({
      message: "User updated successfully",
    user: { _id: userToDelete._id, email: userToDelete.email, name: name, role: userToDelete.role },
  });
 

}
