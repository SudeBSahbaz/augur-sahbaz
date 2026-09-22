-- A. Uğur Şahbaz web sitesi / Akış altyapısı
-- Supabase SQL Editor içinde tek sefer çalıştırın.

create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_tr text not null,
  title_en text,
  excerpt_tr text not null,
  excerpt_en text,
  category_tr text,
  category_en text,
  cover_url text,
  content jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts
for select
to anon, authenticated
using (
  published = true
  or (auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com'
);

drop policy if exists "Admin can insert posts" on public.posts;
create policy "Admin can insert posts"
on public.posts
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com');

drop policy if exists "Admin can update posts" on public.posts;
create policy "Admin can update posts"
on public.posts
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com')
with check ((auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com');

drop policy if exists "Admin can delete posts" on public.posts;
create policy "Admin can delete posts"
on public.posts
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com');

insert into storage.buckets (id, name, public, file_size_limit)
values ('feed-assets', 'feed-assets', true, 4194304)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "Admin can upload feed assets" on storage.objects;
create policy "Admin can upload feed assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'feed-assets'
  and (auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com'
);

drop policy if exists "Admin can update feed assets" on storage.objects;
create policy "Admin can update feed assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'feed-assets'
  and (auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com'
)
with check (
  bucket_id = 'feed-assets'
  and (auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com'
);

drop policy if exists "Admin can delete feed assets" on storage.objects;
create policy "Admin can delete feed assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'feed-assets'
  and (auth.jwt() ->> 'email') = 'ugursahbaz05@yahoo.com'
);

-- ÖNEMLİ:
-- ADMIN_EMAIL'i .env içinde değiştirirseniz, yukarıdaki e-posta adresini de
-- aynı adresle değiştirip politikaları yeniden çalıştırın.
