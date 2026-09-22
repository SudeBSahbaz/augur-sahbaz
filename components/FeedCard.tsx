import { Link } from "@/i18n/navigation";
import type { FeedPost } from "@/lib/feed-types";

function formatDate(value: string | null, locale: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function FeedCard({
  post,
  locale,
}: {
  post: FeedPost;
  locale: string;
}) {
  const isEnglish = locale === "en";
  const title = isEnglish && post.title_en ? post.title_en : post.title_tr;
  const excerpt =
    isEnglish && post.excerpt_en ? post.excerpt_en : post.excerpt_tr;
  const category =
    (isEnglish && post.category_en ? post.category_en : post.category_tr) ||
    (isEnglish ? "Update" : "İçerik");

  return (
    <article className="group overflow-hidden border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
      <Link href={`/feed/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#E9ECEF]">
          {post.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#0B2748_0%,#15375F_55%,#D6AD60_160%)]">
              <span className="text-5xl font-bold tracking-tight text-white/15">
                A. U. Ş.
              </span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-bold tracking-[0.14em]">
            <span className="text-[#B28A42]">{category.toUpperCase()}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-400">
              {formatDate(post.published_at || post.created_at, locale)}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight text-[#0B2748] transition group-hover:text-[#B28A42]">
            {title}
          </h2>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
            {excerpt}
          </p>

          <div className="mt-6 text-xs font-bold tracking-[0.12em] text-[#0B2748]">
            {isEnglish ? "READ →" : "OKU →"}
          </div>
        </div>
      </Link>
    </article>
  );
}
