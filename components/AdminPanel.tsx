"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type {
  FeedContentBlock,
  FeedPost,
  FeedPostInput,
} from "@/lib/feed-types";

type SessionState =
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "signed-in"; email: string };

type FormState = {
  id?: string;
  slug: string;
  titleTr: string;
  titleEn: string;
  excerptTr: string;
  excerptEn: string;
  categoryTr: string;
  categoryEn: string;
  coverUrl: string;
  content: FeedContentBlock[];
  published: boolean;
  publishedAt: string | null;
};

const emptyForm = (): FormState => ({
  slug: "",
  titleTr: "",
  titleEn: "",
  excerptTr: "",
  excerptEn: "",
  categoryTr: "",
  categoryEn: "",
  coverUrl: "",
  content: [],
  published: false,
  publishedAt: null,
});

function slugify(value: string) {
  const map: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  return value
    .split("")
    .map((character) => map[character] ?? character)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function newId() {
  return crypto.randomUUID();
}

function postToForm(post: FeedPost): FormState {
  return {
    id: post.id,
    slug: post.slug,
    titleTr: post.title_tr,
    titleEn: post.title_en || "",
    excerptTr: post.excerpt_tr,
    excerptEn: post.excerpt_en || "",
    categoryTr: post.category_tr || "",
    categoryEn: post.category_en || "",
    coverUrl: post.cover_url || "",
    content: Array.isArray(post.content) ? post.content : [],
    published: post.published,
    publishedAt: post.published_at,
  };
}

export default function AdminPanel() {
  const [session, setSession] = useState<SessionState>({ status: "loading" });
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showEditor, setShowEditor] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const editing = Boolean(form.id);

  const loadPosts = useCallback(async () => {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    if (response.status === 401) {
      setSession({ status: "signed-out" });
      return;
    }
    if (!response.ok) throw new Error("İçerikler yüklenemedi.");
    setPosts((await response.json()) as FeedPost[]);
  }, []);

  useEffect(() => {
    async function init() {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      const data = (await response.json()) as {
        authenticated: boolean;
        configured: boolean;
        email?: string;
      };

      if (!data.configured) {
        setSession({ status: "unconfigured" });
        return;
      }

      if (!data.authenticated) {
        setSession({ status: "signed-out" });
        return;
      }

      setSession({ status: "signed-in", email: data.email || "" });
      await loadPosts();
    }

    init().catch(() => setSession({ status: "signed-out" }));
  }, [loadPosts]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = (await response.json()) as { error?: string; email?: string };

      if (!response.ok) throw new Error(data.error || "Giriş yapılamadı.");

      setSession({ status: "signed-in", email: data.email || loginEmail });
      setLoginPassword("");
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setPosts([]);
    setShowEditor(false);
    setForm(emptyForm());
    setSession({ status: "signed-out" });
  }

  function startNew() {
    setForm(emptyForm());
    setShowEditor(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(post: FeedPost) {
    setForm(postToForm(post));
    setShowEditor(true);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addTextBlock(type: "heading" | "paragraph" | "quote") {
    setForm((current) => ({
      ...current,
      content: [
        ...current.content,
        { id: newId(), type, tr: "", en: "" },
      ],
    }));
  }

  function addListBlock() {
    setForm((current) => ({
      ...current,
      content: [
        ...current.content,
        { id: newId(), type: "list", tr: [""], en: [""] },
      ],
    }));
  }

  function updateBlock(id: string, updater: (block: FeedContentBlock) => FeedContentBlock) {
    setForm((current) => ({
      ...current,
      content: current.content.map((block) =>
        block.id === id ? updater(block) : block
      ),
    }));
  }

  function removeBlock(id: string) {
    setForm((current) => ({
      ...current,
      content: current.content.filter((block) => block.id !== id),
    }));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setForm((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.content.length) return current;
      const next = [...current.content];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, content: next };
    });
  }

  async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });
    const data = (await response.json()) as { url?: string; name?: string; error?: string };
    if (!response.ok || !data.url) {
      throw new Error(data.error || "Dosya yüklenemedi.");
    }
    return { url: data.url, name: data.name || file.name };
  }

  async function uploadCover(file: File) {
    setBusy(true);
    setMessage("");
    try {
      const uploaded = await uploadFile(file);
      setForm((current) => ({ ...current, coverUrl: uploaded.url }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function addUploadedBlock(file: File, type: "image" | "file") {
    setBusy(true);
    setMessage("");
    try {
      const uploaded = await uploadFile(file);
      setForm((current) => ({
        ...current,
        content: [
          ...current.content,
          type === "image"
            ? {
                id: newId(),
                type: "image",
                url: uploaded.url,
                captionTr: "",
                captionEn: "",
              }
            : {
                id: newId(),
                type: "file",
                url: uploaded.url,
                name: uploaded.name,
              },
        ],
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Dosya yüklenemedi.");
    } finally {
      setBusy(false);
    }
  }

  const payload = useMemo<FeedPostInput>(
    () => ({
      slug: form.slug || slugify(form.titleTr),
      title_tr: form.titleTr.trim(),
      title_en: form.titleEn.trim() || null,
      excerpt_tr: form.excerptTr.trim(),
      excerpt_en: form.excerptEn.trim() || null,
      category_tr: form.categoryTr.trim() || null,
      category_en: form.categoryEn.trim() || null,
      cover_url: form.coverUrl || null,
      content: form.content,
      published: form.published,
      published_at: form.publishedAt,
    }),
    [form]
  );

  async function savePost(publishOverride?: boolean) {
    if (!payload.title_tr || !payload.excerpt_tr) {
      setMessage("Türkçe başlık ve özet alanları zorunlu.");
      return;
    }

    const outgoing = {
      ...payload,
      slug: payload.slug || slugify(payload.title_tr),
      published: publishOverride ?? payload.published,
      published_at:
        (publishOverride ?? payload.published)
          ? payload.published_at || new Date().toISOString()
          : null,
    };

    setBusy(true);
    setMessage("");

    try {
      const response = await fetch(
        form.id ? `/api/admin/posts/${form.id}` : "/api/admin/posts",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(outgoing),
        }
      );
      const data = (await response.json()) as FeedPost & { error?: string };
      if (!response.ok) throw new Error(data.error || "İçerik kaydedilemedi.");

      setForm(postToForm(data));
      setMessage(outgoing.published ? "İçerik yayımlandı." : "Taslak kaydedildi.");
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İçerik kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePost(post: FeedPost) {
    if (!window.confirm(`“${post.title_tr}” içeriği kalıcı olarak silinsin mi?`)) {
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("İçerik silinemedi.");
      if (form.id === post.id) {
        setShowEditor(false);
        setForm(emptyForm());
      }
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İçerik silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  if (session.status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-500">
        Yönetim paneli yükleniyor…
      </div>
    );
  }

  if (session.status === "unconfigured") {
    return (
      <div className="mx-auto max-w-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-900">
        <strong>Yönetim paneli hazır, ancak Supabase bağlantısı henüz yapılmamış.</strong>
        <p className="mt-2">
          Projedeki <code>.env.example</code> ve <code>supabase/schema.sql</code>
          dosyalarındaki kurulum adımlarını tamamladıktan sonra bu ekran otomatik
          olarak giriş ekranına dönüşür.
        </p>
      </div>
    );
  }

  if (session.status === "signed-out") {
    return (
      <div className="mx-auto max-w-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold tracking-[0.18em] text-[#B28A42]">
          YÖNETİM PANELİ
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#0B2748]">Giriş</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Bu alan yalnızca yetkili yönetici hesabına açıktır.
        </p>

        <form onSubmit={login} className="mt-7 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">E-posta</span>
            <input
              type="email"
              autoComplete="username"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none transition focus:border-[#B28A42]"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Şifre</span>
            <input
              type="password"
              autoComplete="current-password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none transition focus:border-[#B28A42]"
              required
            />
          </label>

          {message ? (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#0B2748] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#15375F] disabled:opacity-50"
          >
            {busy ? "GİRİŞ YAPILIYOR…" : "GİRİŞ YAP →"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-[#B28A42]">
            YÖNETİM PANELİ
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#0B2748] sm:text-4xl">
            Akış içerikleri
          </h1>
          <p className="mt-2 text-sm text-slate-500">{session.email}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startNew}
            className="bg-[#0B2748] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#15375F]"
          >
            + YENİ İÇERİK
          </button>
          <button
            type="button"
            onClick={logout}
            className="border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-500"
          >
            ÇIKIŞ
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-5 border border-[#D6AD60]/40 bg-[#FFF9EC] px-4 py-3 text-sm text-[#6B5427]">
          {message}
        </div>
      ) : null}

      {showEditor ? (
        <section className="mt-7 border border-slate-200 bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#B28A42]">
                {editing ? "İÇERİĞİ DÜZENLE" : "YENİ İÇERİK"}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#0B2748]">
                {editing ? form.titleTr || "İçerik" : "Yeni paylaşım oluştur"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="self-start text-sm font-bold text-slate-400 hover:text-slate-700"
            >
              KAPAT ×
            </button>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Başlık — TR *</span>
              <input
                value={form.titleTr}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    titleTr: event.target.value,
                    slug: current.id ? current.slug : slugify(event.target.value),
                  }))
                }
                className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none focus:border-[#B28A42]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Title — EN</span>
              <input
                value={form.titleEn}
                onChange={(event) =>
                  setForm((current) => ({ ...current, titleEn: event.target.value }))
                }
                className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none focus:border-[#B28A42]"
              />
            </label>

            <label className="block lg:col-span-2">
              <span className="text-sm font-bold text-slate-700">URL kısa adı</span>
              <div className="mt-2 flex items-center border border-slate-300 bg-slate-50">
                <span className="hidden px-4 text-sm text-slate-400 sm:block">/feed/</span>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: slugify(event.target.value),
                    }))
                  }
                  className="min-w-0 flex-1 bg-white px-4 py-3 outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Kategori — TR</span>
              <input
                value={form.categoryTr}
                onChange={(event) =>
                  setForm((current) => ({ ...current, categoryTr: event.target.value }))
                }
                placeholder="Örn. Üretim"
                className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none focus:border-[#B28A42]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Category — EN</span>
              <input
                value={form.categoryEn}
                onChange={(event) =>
                  setForm((current) => ({ ...current, categoryEn: event.target.value }))
                }
                placeholder="e.g. Production"
                className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none focus:border-[#B28A42]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Özet — TR *</span>
              <textarea
                value={form.excerptTr}
                onChange={(event) =>
                  setForm((current) => ({ ...current, excerptTr: event.target.value }))
                }
                rows={4}
                className="mt-2 w-full resize-y border border-slate-300 px-4 py-3 outline-none focus:border-[#B28A42]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Summary — EN</span>
              <textarea
                value={form.excerptEn}
                onChange={(event) =>
                  setForm((current) => ({ ...current, excerptEn: event.target.value }))
                }
                rows={4}
                className="mt-2 w-full resize-y border border-slate-300 px-4 py-3 outline-none focus:border-[#B28A42]"
              />
            </label>
          </div>

          <div className="mt-7 border-t border-slate-200 pt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0B2748]">Kapak görseli</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Akış kartında ve içerik sayfasının üstünde görünür.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center border border-[#0B2748] px-4 py-2.5 text-xs font-bold text-[#0B2748] transition hover:bg-[#0B2748] hover:text-white">
                GÖRSEL YÜKLE
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadCover(file);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            {form.coverUrl ? (
              <div className="mt-4 flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverUrl}
                  alt="Kapak"
                  className="h-28 w-44 border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, coverUrl: "" }))}
                  className="text-xs font-bold text-red-600"
                >
                  KALDIR
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-7">
            <div>
              <h3 className="text-lg font-bold text-[#0B2748]">İçerik blokları</h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Paragraf, ara başlık, liste, alıntı, görsel veya dosya ekleyebilirsin.
                Blokları yukarı-aşağı taşıyarak sıralayabilirsin. İngilizce alan boşsa
                İngilizce sayfada Türkçe içerik gösterilir.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => addTextBlock("paragraph")} className="admin-chip">+ Paragraf</button>
              <button type="button" onClick={() => addTextBlock("heading")} className="admin-chip">+ Ara başlık</button>
              <button type="button" onClick={addListBlock} className="admin-chip">+ Liste</button>
              <button type="button" onClick={() => addTextBlock("quote")} className="admin-chip">+ Alıntı</button>
              <label className="admin-chip cursor-pointer">
                + Görsel
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void addUploadedBlock(file, "image");
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              <label className="admin-chip cursor-pointer">
                + Dosya / PDF
                <input
                  type="file"
                  className="hidden"
                  disabled={busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void addUploadedBlock(file, "file");
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            <div className="mt-6 space-y-4">
              {form.content.length === 0 ? (
                <div className="border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-400">
                  Henüz içerik bloğu eklenmedi.
                </div>
              ) : null}

              {form.content.map((block, index) => (
                <div key={block.id} className="border border-slate-200 bg-[#FCFCFB] p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] font-bold tracking-[0.15em] text-[#B28A42]">
                      {block.type === "paragraph" && "PARAGRAF"}
                      {block.type === "heading" && "ARA BAŞLIK"}
                      {block.type === "quote" && "ALINTI"}
                      {block.type === "list" && "LİSTE"}
                      {block.type === "image" && "GÖRSEL"}
                      {block.type === "file" && "DOSYA"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button type="button" disabled={index === 0} onClick={() => moveBlock(index, -1)} className="admin-mini">↑</button>
                      <button type="button" disabled={index === form.content.length - 1} onClick={() => moveBlock(index, 1)} className="admin-mini">↓</button>
                      <button type="button" onClick={() => removeBlock(block.id)} className="admin-mini text-red-600">Sil</button>
                    </div>
                  </div>

                  {(block.type === "paragraph" || block.type === "heading" || block.type === "quote") ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      <textarea
                        value={block.tr}
                        onChange={(event) =>
                          updateBlock(block.id, (current) =>
                            current.type === block.type
                              ? { ...current, tr: event.target.value }
                              : current
                          )
                        }
                        rows={block.type === "paragraph" ? 6 : 3}
                        placeholder="Türkçe"
                        className="w-full resize-y border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#B28A42]"
                      />
                      <textarea
                        value={block.en}
                        onChange={(event) =>
                          updateBlock(block.id, (current) =>
                            current.type === block.type
                              ? { ...current, en: event.target.value }
                              : current
                          )
                        }
                        rows={block.type === "paragraph" ? 6 : 3}
                        placeholder="English (optional)"
                        className="w-full resize-y border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#B28A42]"
                      />
                    </div>
                  ) : null}

                  {block.type === "list" ? (
                    <div className="grid gap-5 lg:grid-cols-2">
                      {(["tr", "en"] as const).map((language) => {
                        const items = block[language];
                        return (
                          <div key={language}>
                            <p className="mb-2 text-xs font-bold text-slate-500">
                              {language === "tr" ? "Türkçe" : "English"}
                            </p>
                            <div className="space-y-2">
                              {items.map((item, itemIndex) => (
                                <div key={`${language}-${itemIndex}`} className="flex gap-2">
                                  <input
                                    value={item}
                                    onChange={(event) =>
                                      updateBlock(block.id, (current) => {
                                        if (current.type !== "list") return current;
                                        const next = [...current[language]];
                                        next[itemIndex] = event.target.value;
                                        return { ...current, [language]: next };
                                      })
                                    }
                                    className="min-w-0 flex-1 border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#B28A42]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateBlock(block.id, (current) => {
                                        if (current.type !== "list") return current;
                                        const next = current[language].filter((_, i) => i !== itemIndex);
                                        return { ...current, [language]: next.length ? next : [""] };
                                      })
                                    }
                                    className="admin-mini text-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                updateBlock(block.id, (current) =>
                                  current.type === "list"
                                    ? { ...current, [language]: [...current[language], ""] }
                                    : current
                                )
                              }
                              className="mt-2 text-xs font-bold text-[#0B2748]"
                            >
                              + Madde ekle
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {block.type === "image" ? (
                    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.url} alt="" className="h-40 w-full border border-slate-200 object-cover" />
                      <div className="grid gap-3">
                        <input
                          value={block.captionTr}
                          onChange={(event) =>
                            updateBlock(block.id, (current) =>
                              current.type === "image"
                                ? { ...current, captionTr: event.target.value }
                                : current
                            )
                          }
                          placeholder="Görsel açıklaması — TR"
                          className="border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#B28A42]"
                        />
                        <input
                          value={block.captionEn}
                          onChange={(event) =>
                            updateBlock(block.id, (current) =>
                              current.type === "image"
                                ? { ...current, captionEn: event.target.value }
                                : current
                            )
                          }
                          placeholder="Image caption — EN"
                          className="border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#B28A42]"
                        />
                      </div>
                    </div>
                  ) : null}

                  {block.type === "file" ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input
                        value={block.name}
                        onChange={(event) =>
                          updateBlock(block.id, (current) =>
                            current.type === "file"
                              ? { ...current, name: event.target.value }
                              : current
                          )
                        }
                        className="min-w-0 flex-1 border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#B28A42]"
                      />
                      <a href={block.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#B28A42]">
                        DOSYAYI AÇ ↗
                      </a>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={() => void savePost(false)}
              className="border border-[#0B2748] px-6 py-3 text-sm font-bold text-[#0B2748] transition hover:bg-[#F3F6F9] disabled:opacity-50"
            >
              TASLAK OLARAK KAYDET
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void savePost(true)}
              className="bg-[#0B2748] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#15375F] disabled:opacity-50"
            >
              {busy ? "KAYDEDİLİYOR…" : "YAYINLA →"}
            </button>
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0B2748]">Tüm içerikler</h2>
          <span className="text-sm text-slate-400">{posts.length} kayıt</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-[#F7F7F5] text-xs font-bold tracking-[0.1em] text-slate-500">
              <tr>
                <th className="px-5 py-4">BAŞLIK</th>
                <th className="px-5 py-4">DURUM</th>
                <th className="px-5 py-4">GÜNCELLEME</th>
                <th className="px-5 py-4 text-right">İŞLEM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="max-w-md px-5 py-4">
                    <p className="font-bold text-[#0B2748]">{post.title_tr}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">/feed/{post.slug}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={post.published ? "status-published" : "status-draft"}>
                      {post.published ? "YAYINDA" : "TASLAK"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {new Intl.DateTimeFormat("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(post.updated_at))}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3 whitespace-nowrap">
                      <button type="button" onClick={() => startEdit(post)} className="text-xs font-bold text-[#0B2748] hover:text-[#B28A42]">
                        DÜZENLE
                      </button>
                      <button type="button" onClick={() => void deletePost(post)} className="text-xs font-bold text-red-600 hover:text-red-800">
                        SİL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                    Henüz içerik yok. İlk içeriği oluşturmak için “Yeni İçerik”e tıkla.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
