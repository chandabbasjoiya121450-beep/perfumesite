import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/server/admin-auth";

export async function GET(request: Request) {
  const session = verifyAdminRequest(request);

  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: "Unauthorized access. Valid administrator session required." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role,
    },
  });
}
