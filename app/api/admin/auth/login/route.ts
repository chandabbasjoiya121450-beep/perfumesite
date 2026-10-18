import { NextResponse } from "next/server";
import { validateAdminCredentials, signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    const token = signAdminToken(email);

    const response = NextResponse.json({
      success: true,
      user: {
        email: email.trim().toLowerCase(),
        role: "administrator",
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during administrative authentication." },
      { status: 500 }
    );
  }
}
