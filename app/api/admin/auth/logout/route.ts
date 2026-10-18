import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/server/admin-auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Administrator session terminated.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
