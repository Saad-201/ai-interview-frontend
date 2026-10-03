import { NextResponse } from "next/server";
import db from "@/lib/db"; //to send response back to the browser & importing our database connection from db.ts file

export async function POST(request: Request) {
  try {
    const body = await request.json(); // reading and submitting data

    const { email, password } = body;

    const user = db
      .prepare( // We're asking sqlite to find a user whose email and password match what was submitted.
        `
        SELECT id, email, role
        FROM users
        WHERE email = ? AND password = ?
        `
      )
      .get(email, password) as
      | {
          id: number;
          email: string;
          role: string;
        }
      | undefined;

    if (!user) { //if the user is not found 
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ //if the user is found 
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("auth_token", "mock-jwt-token", { //creating the autherntacation token
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

//route.ts is responisable for asking the database weather login credentials are correct or not and sending the response back ro the browser.