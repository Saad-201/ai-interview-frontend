import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body; //this gets info from the registration form.

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = db
      .prepare(
        `
        SELECT id
        FROM users
        WHERE email = ?
        `
        //this checks if the email already exists in the database
      )
      .get(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const result = db
      .prepare(
        `
        INSERT INTO users (email, password, role)
        VALUES (?, ?, ?)
        `
      )
      .run(email, password, "Candidate");

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: result.lastInsertRowid,
          email,
          role: "Candidate",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}