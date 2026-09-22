import { NextResponse } from "next/server";
import { getAdminConfig, getAdminSession } from "@/lib/admin-auth";
import type { FeedPostInput } from "@/lib/feed-types";

async function authorizedRest(path: string, init?: RequestInit) {
  const config = getAdminConfig();
  const session = await getAdminSession();

  if (!config || !session.authenticated) return null;

  const headers = new Headers(init?.headers);
  headers.set("apikey", config.anonKey);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as FeedPostInput;

  const payload = {
    ...body,
    title_en: body.title_en || null,
    excerpt_en: body.excerpt_en || null,
    category_tr: body.category_tr || null,
    category_en: body.category_en || null,
    cover_url: body.cover_url || null,
    published_at: body.published
      ? body.published_at || new Date().toISOString()
      : null,
    updated_at: new Date().toISOString(),
  };

  const response = await authorizedRest(
    `posts?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    }
  );

  if (!response) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: await response.text() }, { status: 400 });
  }

  const rows = await response.json();
  return NextResponse.json(rows[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const response = await authorizedRest(
    `posts?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    }
  );

  if (!response) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: await response.text() }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
