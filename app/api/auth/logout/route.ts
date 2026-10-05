import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout successful",
  });

  response.cookies.set("auth_token", "", { // this removes the cookie by setting it to an empty string
    httpOnly: true,
    expires: new Date(0), // and this makes the cookie expire immediately
    path: "/",
  });

  return response;
}