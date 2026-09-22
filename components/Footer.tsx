import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer({ locale }: { locale: string }) {
  const nav = await getTranslations("Navigation");
  const brand = await getTranslations("Brand");
  const footer = await getTranslations("Footer");
  const homePrefix = locale === "en" ? "/en" : "";

  return (
    <footer className="bg-[#071F3B] px-5 py-9 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-9 border-b border-white/10 pb-8 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold">{brand("name")}</p>

            <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
              {footer("role1")}
              <br />
              {footer("role2")}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#D6AD60]">
              {footer("quickLinks")}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70">
              <a href={`${homePrefix}/#top`} className="hover:text-white">
                {nav("home")}
              </a>

              <a href={`${homePrefix}/#hakkinda`} className="hover:text-white">
                {nav("about")}
              </a>

              <a href={`${homePrefix}/#hizmetler`} className="hover:text-white">
                {nav("services")}
              </a>

              <a href={`${homePrefix}/#deneyim`} className="hover:text-white">
                {nav("experience")}
              </a>

              <Link href="/feed" className="hover:text-white">
                {nav("feed")}
              </Link>

              <a href={`${homePrefix}/#iletisim`} className="hover:text-white">
                {nav("contact")}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#D6AD60]">
              {footer("contact")}
            </p>

            <div className="mt-4 space-y-3 break-words text-sm text-white/70">
              <a href="tel:+905324522088" className="block hover:text-white">
                +90 532 452 20 88
              </a>

              <a
                href="mailto:ugursahbaz05@yahoo.com"
                className="block break-all hover:text-white"
              >
                ugursahbaz05@yahoo.com
              </a>

              <p>https://augur-sahbaz.vercel.app</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>{footer("copyright")}</p>

          <Link href="/privacy" className="w-fit transition hover:text-white">
            {locale === "tr" ? "KVKK Aydınlatma Metni" : "Privacy Notice"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
