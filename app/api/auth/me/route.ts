import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth_token")?.value; //this looks for the cookie that API login craated 

    if (!authToken) { //in case of no cookie found 
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = Number(authToken); //converting to strings 

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }
 
    const user = db //finding the user in the database
      .prepare(
        `
        SELECT id, email, role
        FROM users
        WHERE id = ?
        `
      )
      .get(userId) as
      | {
          id: number;
          email: string;
          role: string;
        }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Me API error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}