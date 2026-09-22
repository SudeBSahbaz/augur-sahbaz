This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## A. Uğur Şahbaz sitesi — Akış / Feed kurulumu

Bu sürümde iki yeni özellik bulunur:

- Dil anahtarı artık `TR → EN → TR` şeklinde güvenilir biçimde çalışır ve bulunduğunuz sayfayı korur.
- `/feed` (`/en/feed`) sayfası ile yalnızca yetkili hesabın erişebildiği `/admin` içerik yönetim paneli eklenmiştir.

### 1. Supabase projesi oluşturun

Supabase'te yeni bir proje açın. **SQL Editor** bölümünde `supabase/schema.sql` dosyasını çalıştırın.

> Yönetici e-postasını değiştirecekseniz `schema.sql` içindeki `ugursahbaz05@yahoo.com` değerini de aynı e-posta ile değiştirin.

### 2. Yönetici hesabını oluşturun

Supabase Dashboard → **Authentication → Users** bölümünden yönetici kullanıcısını manuel olarak oluşturun. Bu projede varsayılan yetkili e-posta:

`ugursahbaz05@yahoo.com`

Hesabı oluştururken e-postayı doğrulanmış olarak işaretleyin ve güçlü bir şifre belirleyin. Sitede herkese açık bir kayıt olma (sign-up) ekranı yoktur.

### 3. Ortam değişkenlerini ekleyin

`.env.example` dosyasını `.env.local` olarak kopyalayın ve Supabase Dashboard → **Project Settings → API** bölümündeki değerleri girin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
ADMIN_EMAIL=ugursahbaz05@yahoo.com
```

Aynı üç değişkeni Vercel projesinde **Settings → Environment Variables** bölümüne de ekleyin.

### 4. Yönetim paneli

Yönetim paneli navigasyonda görünmez ve arama motorlarına kapalıdır.

- Türkçe: `/admin`
- İngilizce locale altında da çalışır: `/en/admin`

Giriş yapılmadan yazılar, taslaklar ve yönetim araçları görüntülenmez. Yetki hem uygulama katmanında hem de Supabase Row Level Security (RLS) politikalarıyla sınırlandırılmıştır.

Panelden:

- yeni içerik oluşturma,
- taslak kaydetme / yayımlama,
- Türkçe ve isteğe bağlı İngilizce alanlar,
- kapak görseli,
- paragraf / ara başlık / liste / alıntı blokları,
- içerik içine görsel,
- PDF veya başka dosya ekleme (dosya başına en fazla 4 MB),
- mevcut içeriği düzenleme veya silme

yapılabilir.

### 5. Yerelde çalıştırma

```bash
npm install
npm run dev
```

Ardından `http://localhost:3000` adresini açın.
