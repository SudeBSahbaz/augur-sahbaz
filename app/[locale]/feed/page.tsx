import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedCard from "@/components/FeedCard";
import { getPublishedPosts, isSupabaseConfigured } from "@/lib/supabase-rest";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEnglish = locale === "en";
  const baseUrl = "https://augur-sahbaz.vercel.app";

  return {
    title: isEnglish ? "Feed | A. Uğur Şahbaz" : "Akış | A. Uğur Şahbaz",
    description: isEnglish
      ? "Technical notes, field observations and updates on confectionery production and operations."
      : "Şekerleme üretimi, teknik operasyon ve saha deneyimleri üzerine yazılar, notlar ve güncellemeler.",
    alternates: {
      canonical: isEnglish ? `${baseUrl}/en/feed` : `${baseUrl}/feed`,
      languages: {
        tr: `${baseUrl}/feed`,
        en: `${baseUrl}/en/feed`,
        "x-default": `${baseUrl}/feed`,
      },
    },
  };
}

export default async function FeedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEnglish = locale === "en";
  const posts = await getPublishedPosts();
  const configured = isSupabaseConfigured();

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <Header />

      <section className="border-b border-slate-200 bg-white px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#B28A42] sm:text-sm">
            {isEnglish ? "FIELD NOTES & INSIGHTS" : "SAHADAN NOTLAR & İÇGÖRÜLER"}
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <h1 className="text-5xl font-bold tracking-tight text-[#0B2748] sm:text-6xl">
              {isEnglish ? "Feed" : "Akış"}
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end">
              {isEnglish
                ? "Notes, field observations, documents and experience from production and technical operations."
                : "Üretim ve teknik operasyonlardan notlar, saha gözlemleri, dokümanlar ve deneyimler."}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <FeedCard key={post.id} post={post} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="border border-slate-200 bg-white px-6 py-16 text-center sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#D6AD60] text-xl font-bold text-[#B28A42]">
                A
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#0B2748]">
                {configured
                  ? isEnglish
                    ? "No published content yet."
                    : "Henüz yayımlanmış içerik yok."
                  : isEnglish
                    ? "The feed is being prepared."
                    : "Akış hazırlanıyor."}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                {isEnglish
                  ? "New technical notes and updates will appear here."
                  : "Yeni teknik notlar ve paylaşımlar yayımlandıkça burada görünecek."}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
