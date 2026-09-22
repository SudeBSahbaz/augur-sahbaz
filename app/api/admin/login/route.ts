import { NextResponse } from "next/server";
import {
  clearAdminSession,
  getAdminConfig,
  setAdminSession,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const config = getAdminConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Supabase yapılandırması eksik." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-posta ve şifre gerekli." },
      { status: 400 }
    );
  }

  if (email !== config.adminEmail) {
    await clearAdminSession();
    return NextResponse.json(
      { error: "Bu hesap yönetim paneline yetkili değil." },
      { status: 403 }
    );
  }

  const authResponse = await fetch(
    `${config.url}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    }
  );

  if (!authResponse.ok) {
    return NextResponse.json(
      { error: "E-posta veya şifre hatalı." },
      { status: 401 }
    );
  }

  const tokens = (await authResponse.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user?: { email?: string };
  };

  if (tokens.user?.email?.toLowerCase() !== config.adminEmail) {
    await clearAdminSession();
    return NextResponse.json(
      { error: "Bu hesap yönetim paneline yetkili değil." },
      { status: 403 }
    );
  }

  await setAdminSession(tokens);
  return NextResponse.json({ ok: true, email: tokens.user?.email });
}
