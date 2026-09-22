import type { FeedContentBlock } from "@/lib/feed-types";

export default function FeedPostContent({
  blocks,
  locale,
}: {
  blocks: FeedContentBlock[];
  locale: string;
}) {
  const isEnglish = locale === "en";

  return (
    <div className="space-y-7">
      {blocks.map((block) => {
        if (block.type === "heading") {
          const text = isEnglish && block.en ? block.en : block.tr;
          if (!text) return null;
          return (
            <h2
              key={block.id}
              className="pt-4 text-2xl font-bold leading-tight text-[#0B2748] sm:text-3xl"
            >
              {text}
            </h2>
          );
        }

        if (block.type === "paragraph") {
          const text = isEnglish && block.en ? block.en : block.tr;
          if (!text) return null;
          return (
            <p
              key={block.id}
              className="whitespace-pre-line text-[17px] leading-8 text-slate-600"
            >
              {text}
            </p>
          );
        }

        if (block.type === "quote") {
          const text = isEnglish && block.en ? block.en : block.tr;
          if (!text) return null;
          return (
            <blockquote
              key={block.id}
              className="border-l-4 border-[#D6AD60] bg-[#F7F7F5] px-6 py-5 text-lg font-medium italic leading-8 text-[#0B2748]"
            >
              {text}
            </blockquote>
          );
        }

        if (block.type === "list") {
          const trItems = block.tr.filter((item) => item.trim());
          const enItems = block.en.filter((item) => item.trim());
          const items = isEnglish && enItems.length ? enItems : trItems;
          if (!items.length) return null;
          return (
            <ul
              key={block.id}
              className="space-y-3 pl-1 text-[17px] leading-8 text-slate-600"
            >
              {items.map((item, index) => (
                <li key={`${block.id}-${index}`} className="flex gap-3">
                  <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D6AD60]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "image") {
          const caption =
            isEnglish && block.captionEn ? block.captionEn : block.captionTr;
          return (
            <figure key={block.id} className="my-9">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.url}
                alt={caption || ""}
                className="w-full border border-slate-200 object-cover"
              />
              {caption ? (
                <figcaption className="mt-3 text-sm leading-6 text-slate-500">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === "file") {
          return (
            <a
              key={block.id}
              href={block.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 border border-slate-200 bg-[#F7F7F5] px-5 py-4 text-sm font-bold text-[#0B2748] transition hover:border-[#D6AD60]"
            >
              <span className="min-w-0 truncate">{block.name}</span>
              <span className="shrink-0 text-[#B28A42]">
                {isEnglish ? "OPEN ↗" : "AÇ ↗"}
              </span>
            </a>
          );
        }

        return null;
      })}
    </div>
  );
}
