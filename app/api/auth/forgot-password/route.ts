import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = db
      .prepare(
        `
        SELECT id, email
        FROM users
        WHERE email = ?
        `
      )
      .get(email);

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Password reset request received",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}