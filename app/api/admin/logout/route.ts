import { NextResponse } from "next/server";
import { clearAdminSession, getAdminSession, getAdminConfig } from "@/lib/admin-auth";

export async function POST() {
  const session = await getAdminSession();
  const config = getAdminConfig();

  if (session.authenticated && config) {
    await fetch(`${config.url}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }).catch(() => undefined);
  }

  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
