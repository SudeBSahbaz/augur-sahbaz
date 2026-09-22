export type TextContentBlock = {
  id: string;
  type: "heading" | "paragraph" | "quote";
  tr: string;
  en: string;
};

export type ListContentBlock = {
  id: string;
  type: "list";
  tr: string[];
  en: string[];
};

export type ImageContentBlock = {
  id: string;
  type: "image";
  url: string;
  captionTr: string;
  captionEn: string;
};

export type FileContentBlock = {
  id: string;
  type: "file";
  url: string;
  name: string;
};

export type FeedContentBlock =
  | TextContentBlock
  | ListContentBlock
  | ImageContentBlock
  | FileContentBlock;

export type FeedPost = {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string | null;
  excerpt_tr: string;
  excerpt_en: string | null;
  category_tr: string | null;
  category_en: string | null;
  cover_url: string | null;
  content: FeedContentBlock[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FeedPostInput = Omit<
  FeedPost,
  "id" | "created_at" | "updated_at" | "published_at"
> & {
  published_at?: string | null;
};
