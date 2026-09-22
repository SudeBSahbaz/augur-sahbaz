import type { FeedPost } from "@/lib/feed-types";

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured() {
  return Boolean(getConfig());
}

async function publicRestFetch(path: string, init?: RequestInit) {
  const config = getConfig();
  if (!config) return null;

  const headers = new Headers(init?.headers);
  headers.set("apikey", config.anonKey);
  headers.set("Authorization", `Bearer ${config.anonKey}`);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function getPublishedPosts(): Promise<FeedPost[]> {
  const response = await publicRestFetch(
    "posts?select=*&published=eq.true&order=published_at.desc.nullslast,created_at.desc"
  );

  if (!response || !response.ok) return [];
  return (await response.json()) as FeedPost[];
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<FeedPost | null> {
  const response = await publicRestFetch(
    `posts?select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`
  );

  if (!response || !response.ok) return null;
  const rows = (await response.json()) as FeedPost[];
  return rows[0] ?? null;
}

export function getPublicSupabaseConfig() {
  return getConfig();
}
