import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

const baseUrl = "https://augur-sahbaz.vercel.app";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const isEnglish = locale === "en";

  const title = isEnglish
    ? "A. Uğur Şahbaz | Confectionery Production & Technical Operations Consultant"
    : "A. Uğur Şahbaz | Şekerleme Üretimi ve Teknik Operasyon Danışmanı";

  const description = isEnglish
    ? "Technical consultancy focused on confectionery production, process management, operational efficiency, quality and production line development across Türkiye, the Middle East and South Asia."
    : "Şekerleme üretimi, proses yönetimi, operasyonel verimlilik, kalite ve üretim hattı geliştirme alanlarında Türkiye, Orta Doğu ve Güney Asya deneyimine dayalı teknik danışmanlık.";

  const canonical = isEnglish ? `${baseUrl}/en` : baseUrl;

  return {
    metadataBase: new URL(baseUrl),

    title,

    description,

    alternates: {
      canonical,
      languages: {
        tr: baseUrl,
        en: `${baseUrl}/en`,
        "x-default": baseUrl,
      },
    },

    openGraph: {
      type: "website",
      locale: isEnglish ? "en_US" : "tr_TR",
      alternateLocale: isEnglish ? ["tr_TR"] : ["en_US"],
      url: canonical,
      siteName: "A. Uğur Şahbaz",
      title,
      description,
      images: [
        {
          url: "/images/ugursahbaz.png",
          width: 1104,
          height: 1376,
          alt: "A. Uğur Şahbaz",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/ugursahbaz.png"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      {children}
    </NextIntlClientProvider>
  );
}