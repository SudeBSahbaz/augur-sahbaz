import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedPostContent from "@/components/FeedPostContent";
import { Link } from "@/i18n/navigation";
import { getPublishedPostBySlug } from "@/lib/supabase-rest";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDate(value: string | null, locale: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const isEnglish = locale === "en";
  const title = isEnglish && post.title_en ? post.title_en : post.title_tr;
  const description =
    isEnglish && post.excerpt_en ? post.excerpt_en : post.excerpt_tr;
  const baseUrl = "https://augur-sahbaz.vercel.app";

  return {
    title: `${title} | A. Uğur Şahbaz`,
    description,
    alternates: {
      canonical: isEnglish
        ? `${baseUrl}/en/feed/${post.slug}`
        : `${baseUrl}/feed/${post.slug}`,
      languages: {
        tr: `${baseUrl}/feed/${post.slug}`,
        en: `${baseUrl}/en/feed/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function FeedDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const isEnglish = locale === "en";
  const title = isEnglish && post.title_en ? post.title_en : post.title_tr;
  const excerpt =
    isEnglish && post.excerpt_en ? post.excerpt_en : post.excerpt_tr;
  const category =
    (isEnglish && post.category_en ? post.category_en : post.category_tr) ||
    (isEnglish ? "Update" : "İçerik");

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <Header />

      <article>
        <header className="bg-white px-5 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/feed"
              className="text-xs font-bold tracking-[0.14em] text-[#B28A42] transition hover:text-[#0B2748]"
            >
              ← {isEnglish ? "BACK TO FEED" : "AKIŞA DÖN"}
            </Link>

            <div className="mt-9 flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.13em]">
              <span className="text-[#B28A42]">{category.toUpperCase()}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-slate-400">
                {formatDate(post.published_at || post.created_at, locale)}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-[#0B2748] sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {excerpt}
            </p>
          </div>
        </header>

        {post.cover_url ? (
          <div className="px-5 pt-8 sm:px-6 sm:pt-10">
            <div className="mx-auto max-w-5xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_url}
                alt={title}
                className="max-h-[620px] w-full border border-slate-200 object-cover"
              />
            </div>
          </div>
        ) : null}

        <section className="px-5 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12">
            <FeedPostContent blocks={post.content || []} locale={locale} />
          </div>
        </section>
      </article>

      <Footer locale={locale} />
    </main>
  );
}
