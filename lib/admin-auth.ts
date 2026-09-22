import { cookies } from "next/headers";

const ACCESS_COOKIE = "augur-admin-access";
const REFRESH_COOKIE = "augur-admin-refresh";

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail =
    process.env.ADMIN_EMAIL || "ugursahbaz05@yahoo.com";

  if (!url || !anonKey) return null;
  return { url, anonKey, adminEmail: adminEmail.toLowerCase() };
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

async function getUser(accessToken: string) {
  const config = getConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  return (await response.json()) as { email?: string };
}

async function refreshAccessToken(refreshToken: string) {
  const config = getConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.url}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    }
  );

  if (!response.ok) return null;
  return (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user?: { email?: string };
  };
}

export async function setAdminSession(tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) {
  const store = await cookies();
  store.set(
    ACCESS_COOKIE,
    tokens.access_token,
    cookieOptions(Math.max(tokens.expires_in - 60, 60))
  );
  store.set(
    REFRESH_COOKIE,
    tokens.refresh_token,
    cookieOptions(60 * 60 * 24 * 30)
  );
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(ACCESS_COOKIE, "", cookieOptions(0));
  store.set(REFRESH_COOKIE, "", cookieOptions(0));
}

export async function getAdminSession() {
  const config = getConfig();
  if (!config) {
    return { authenticated: false as const, configured: false as const };
  }

  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (accessToken) {
    const user = await getUser(accessToken);
    if (user?.email?.toLowerCase() === config.adminEmail) {
      return {
        authenticated: true as const,
        configured: true as const,
        accessToken,
        email: user.email,
      };
    }
  }

  if (refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    const email = refreshed?.user?.email?.toLowerCase();

    if (refreshed && email === config.adminEmail) {
      await setAdminSession(refreshed);
      return {
        authenticated: true as const,
        configured: true as const,
        accessToken: refreshed.access_token,
        email: refreshed.user?.email || config.adminEmail,
      };
    }
  }

  await clearAdminSession();
  return { authenticated: false as const, configured: true as const };
}

export function getAdminConfig() {
  return getConfig();
}
