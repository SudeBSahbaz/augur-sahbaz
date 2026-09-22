import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();

  if (!session.configured) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  if (!session.authenticated) {
    return NextResponse.json({ authenticated: false, configured: true });
  }

  return NextResponse.json({
    authenticated: true,
    configured: true,
    email: session.email,
  });
}
