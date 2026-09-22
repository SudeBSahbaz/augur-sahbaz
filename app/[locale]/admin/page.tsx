import type { Metadata } from "next";
import AdminPanel from "@/components/AdminPanel";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Yönetim Paneli | A. Uğur Şahbaz",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <div className="border-b border-white/10 bg-[#0B2748] px-5 py-5 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-base font-bold tracking-wide">A. UĞUR ŞAHBAZ</p>
          <p className="mt-1 text-[10px] tracking-[0.15em] text-white/50">
            İÇERİK YÖNETİMİ
          </p>
        </div>
      </div>

      <section className="px-5 py-8 sm:px-6 sm:py-10">
        <AdminPanel />
      </section>
    </main>
  );
}
